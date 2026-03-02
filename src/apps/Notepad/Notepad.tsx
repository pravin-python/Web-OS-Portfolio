import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Loader2,
  Menu,
} from "lucide-react";
import { storage } from "../../services/storage";
import "./Notepad.css";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
}

const NOTES_KEY = "notepad_notes";
const LAST_ACTIVE_KEY = "notepad_last_active_id";

function loadNotes(): Note[] {
  return storage.get<Note[]>(NOTES_KEY, []) ?? [];
}

function saveNotes(notes: Note[]): void {
  storage.set(NOTES_KEY, notes);
}

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const generateId = () =>
  `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const Notepad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Local editor state for current active note
  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">(
    "idle",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Debounce the local content & title for auto-saving
  const debouncedContent = useDebounce(localContent, 800);
  const debouncedTitle = useDebounce(localTitle, 800);

  // 1. Initial Load
  useEffect(() => {
    const saved = loadNotes();
    // Sort by most recently updated
    saved.sort((a, b) => b.updatedAt - a.updatedAt);
    setNotes(saved);

    const lastActive = storage.get<string | null>(LAST_ACTIVE_KEY, null);
    if (lastActive && saved.some((n) => n.id === lastActive)) {
      handleSelectNote(lastActive, saved);
    } else if (saved.length > 0) {
      handleSelectNote(saved[0].id, saved);
    }
  }, []);

  // 2. Select Note Logic
  const handleSelectNote = (id: string, notesList = notes) => {
    const note = notesList.find((n) => n.id === id);
    if (note) {
      setActiveNoteId(id);
      setLocalTitle(note.title);
      setLocalContent(note.content);
      storage.set(LAST_ACTIVE_KEY, id);
      setSaveStatus("idle");
      // Close sidebar on mobile
      setIsSidebarOpen(false);
      // Give React a tick to mount the textArea if it's the first time
      setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
    }
  };

  // 3. Auto-Save Logic
  useEffect(() => {
    if (!activeNoteId) return;

    const currentNote = notes.find((n) => n.id === activeNoteId);
    if (!currentNote) return;

    // Check if anything actually changed vs what is stored
    if (
      currentNote.title === debouncedTitle &&
      currentNote.content === debouncedContent
    ) {
      if (saveStatus === "saving") setSaveStatus("saved");
      return;
    }

    // Auto-save
    const updatedNotes = notes.map((n) => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: debouncedTitle,
          content: debouncedContent,
          updatedAt: Date.now(),
        };
      }
      return n;
    });

    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setSaveStatus("saved");

    // Auto-hide the "Saved" indicator after 2s
    const t = setTimeout(() => setSaveStatus("idle"), 2000);
    return () => clearTimeout(t);
  }, [debouncedContent, debouncedTitle, activeNoteId]);

  // Handle immediate typing state
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    setSaveStatus("saving");
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    setSaveStatus("saving");
  };

  // 4. Create New Note
  const handleCreateNew = () => {
    const newNote: Note = {
      id: generateId(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    handleSelectNote(newNote.id, updatedNotes);
  };

  // 5. Delete Note
  const handleDelete = (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    if (activeNoteId === noteId) {
      storage.set(LAST_ACTIVE_KEY, null);
      if (updatedNotes.length > 0) {
        handleSelectNote(updatedNotes[0].id, updatedNotes);
      } else {
        setActiveNoteId(null);
        setLocalTitle("");
        setLocalContent("");
      }
    }
  };

  // 6. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault(); // prevent browser new window
        handleCreateNew();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notes]);

  // 7. Filtered Notes
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim())
      return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    const q = searchQuery.toLowerCase();
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);

  // Derived state
  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="notepad-root">
      {/* Mobile Sidebar Toggle Area */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[5] bg-black/20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1️⃣ Left Sidebar — Notes Manager */}
      <div className={`notepad-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="notepad-sidebar-header">
          <button className="btn-new-note" onClick={handleCreateNew}>
            <Plus size={16} /> New Note
          </button>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notepad-search"
            />
          </div>
        </div>

        <div className="notepad-list">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              {searchQuery ? "No matches found." : "No notes yet."}
            </div>
          ) : (
            filteredNotes.map((n) => (
              <div
                key={n.id}
                className={`notepad-list-item ${n.id === activeNoteId ? "active" : ""}`}
                onClick={() => handleSelectNote(n.id)}
              >
                <div className="notepad-item-title">
                  {n.title || "Untitled Note"}
                </div>
                <div className="notepad-item-preview">
                  {n.content || "Empty content"}
                </div>
                <div className="notepad-item-date">
                  {new Date(n.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <button
                  className="notepad-item-delete"
                  onClick={(e) => handleDelete(n.id, e)}
                  title="Delete Note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2️⃣ Main Editor Area */}
      <div className="notepad-main">
        {activeNote ? (
          <>
            {/* Top Toolbar */}
            <div className="notepad-toolbar">
              <div className="flex items-center gap-2 flex-1">
                <button
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <input
                  type="text"
                  value={localTitle}
                  onChange={handleTitleChange}
                  placeholder="Note Title"
                  className="notepad-title-input"
                />
              </div>

              <div className="notepad-status">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Saved</span>
                  </>
                )}
                <button
                  onClick={() => handleDelete(activeNote.id)}
                  className="ml-3 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <textarea
              ref={editorRef}
              className="notepad-editor"
              placeholder="Start writing your thoughts..."
              value={localContent}
              onChange={handleContentChange}
              spellCheck={false}
            />
          </>
        ) : (
          <div className="notepad-empty">
            <button
              className="md:hidden absolute top-4 left-4 p-2 text-slate-500 hover:bg-slate-100 rounded"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300">
              <Plus size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
              No Note Selected
            </h3>
            <p className="text-sm">
              Select a note or create a new one to start writing.
            </p>
            <button
              className="mt-4 btn-new-note"
              style={{ width: "auto", padding: "8px 20px" }}
              onClick={handleCreateNew}
            >
              Create Note (Ctrl + N)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
