import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FileText, Save, Plus } from 'lucide-react';

export const Notepad: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [activeNote, setActiveNote] = useState<any | null>(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes/');
            if (res.data.success) {
                setNotes(res.data.data);
            }
        } catch (e) {
            console.error('Failed to fetch notes');
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSelectNote = (note: any) => {
        setActiveNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleSave = async () => {
        try {
            if (activeNote) {
                await api.put(`/notes/${activeNote.id}/`, { title, content });
            } else {
                await api.post('/notes/', { title: title || 'Untitled', content });
            }
            fetchNotes();
            // Optional: show a small toast or save indicator
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateNew = () => {
        setActiveNote(null);
        setTitle('');
        setContent('');
    };

    return (
        <div className="flex h-full w-full bg-white dark:bg-slate-900 border border-transparent">
            {/* Sidebar ListView */}
            <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-800/50">
                <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Notes</span>
                    <button onClick={handleCreateNew} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-600 dark:text-slate-400">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {notes.map(n => (
                        <div
                            key={n.id}
                            className={`p-3 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors ${activeNote?.id === n.id ? 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-500' : ''}`}
                            onClick={() => handleSelectNote(n)}
                        >
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{n.title}</div>
                            <div className="text-xs text-slate-500 truncate mt-1">{n.content}</div>
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
                    <button onClick={handleSave} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-sm transition-colors">
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
            </div>
        </div>
    );
};
