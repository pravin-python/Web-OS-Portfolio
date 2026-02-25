import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { storage } from '../../services/storage';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

const NOTES_KEY = 'notes';

function loadNotes(): Note[] {
    return storage.get<Note[]>(NOTES_KEY, []) ?? [];
}

function saveNotes(notes: Note[]): void {
    storage.set(NOTES_KEY, notes);
}

export const Notepad: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    // Load notes from localStorage on mount
    useEffect(() => {
        const saved = loadNotes();
        setNotes(saved);
        if (saved.length > 0) {
            handleSelectNote(saved[0]);
        }
    }, []);

    const handleSelectNote = (note: Note) => {
        setActiveNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        let updatedNotes: Note[];

        if (activeNote) {
            // Update existing note
            updatedNotes = notes.map(n =>
                n.id === activeNote.id
                    ? { ...n, title: title || 'Untitled', content, updatedAt: Date.now() }
                    : n
            );
        } else {
            // Create new note
            const newNote: Note = {
                id: `note-${Date.now()}`,
                title: title || 'Untitled',
                content,
                updatedAt: Date.now(),
            };
            updatedNotes = [newNote, ...notes];
            setActiveNote(newNote);
        }

        setNotes(updatedNotes);
        saveNotes(updatedNotes);
    };

    const handleCreateNew = () => {
        setActiveNote(null);
        setTitle('');
        setContent('');
    };

    const handleDelete = (noteId: string) => {
        const updatedNotes = notes.filter(n => n.id !== noteId);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);

        if (activeNote?.id === noteId) {
            if (updatedNotes.length > 0) {
                handleSelectNote(updatedNotes[0]);
            } else {
                handleCreateNew();
            }
        }
    };

    return (
        <div className="flex h-full w-full bg-white dark:bg-slate-900 border border-transparent">
            {/* Sidebar ListView */}
            <div className="w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800/50 hidden md:flex">
                <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Notes</span>
                    <button
                        onClick={handleCreateNew}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400"
                        title="New note"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {notes.length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-400">
                            No notes yet. Click + to create one.
                        </div>
                    )}
                    {notes.map(n => (
                        <div
                            key={n.id}
                            className={`p-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors group ${activeNote?.id === n.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-500' : ''
                                }`}
                            onClick={() => handleSelectNote(n)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-medium text-slate-800 dark:text-slate-200 truncate flex-1">{n.title}</div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-all"
                                    title="Delete note"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="text-xs text-slate-500 truncate mt-1">{n.content || '(empty)'}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor View */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex space-x-2 items-center">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title"
                        className="flex-1 bg-transparent px-2 py-1 outline-none text-lg font-medium text-slate-800 dark:text-slate-200"
                    />
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-sm transition-colors"
                    >
                        <Save size={14} />
                        <span>Save</span>
                    </button>
                </div>
                <textarea
                    className="flex-1 p-4 bg-transparent outline-none resize-none text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
                    placeholder="Start typing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="px-4 py-1 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    {activeNote ? `Saved locally • ${new Date(activeNote.updatedAt).toLocaleString()}` : 'New note — click Save to persist locally'}
                </div>
            </div>
        </div>
    );
};
