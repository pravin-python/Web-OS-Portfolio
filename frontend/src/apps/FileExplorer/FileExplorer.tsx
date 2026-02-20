import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Folder, File, ArrowLeft, ArrowUp, RefreshCw } from 'lucide-react';

export const FileExplorer: React.FC = () => {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchContents = async (parentId: string | null = null) => {
        setLoading(true);
        try {
            const res = await api.get('/filesystem/', {
                params: { parent_id: parentId || '' }
            });
            if (res.data.success) {
                setNodes(res.data.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents(currentFolderId);
    }, [currentFolderId]);

    const navigateTo = (folderId: string) => {
        if (currentFolderId) {
            setHistory(prev => [...prev, currentFolderId]);
        }
        setCurrentFolderId(folderId);
    };

    const goBack = () => {
        if (history.length > 0) {
            const newHistory = [...history];
            const prev = newHistory.pop();
            setHistory(newHistory);
            setCurrentFolderId(prev || null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-transparent">
            {/* Top action bar */}
            <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={goBack}
                    disabled={history.length === 0}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={() => fetchContents(currentFolderId)}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    <RefreshCw size={16} />
                </button>
                <div className="flex-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300">
                    Path: {currentFolderId || 'Root'}
                </div>
            </div>

            {/* Main content grid */}
            <div className="flex-1 p-4 overflow-y-auto w-full flex content-start flex-wrap gap-4">
                {loading ? (
                    <div className="w-full text-center py-10 opacity-50">Loading...</div>
                ) : nodes.length === 0 ? (
                    <div className="w-full text-center py-10 opacity-50 text-sm">Empty folder</div>
                ) : (
                    nodes.map(node => (
                        <div
                            key={node.id}
                            className="w-24 flex flex-col items-center justify-start p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer text-center group"
                            onDoubleClick={() => {
                                if (node.item_type === 'FOLDER') navigateTo(node.id);
                                // else open default reader for file (can be extended using windowStore.openWindow('Notepad'))
                            }}
                        >
                            {node.item_type === 'FOLDER' ? (
                                <Folder size={40} className="text-yellow-400 group-hover:scale-105 transition-transform" fill="currentColor" />
                            ) : (
                                <File size={40} className="text-blue-400 group-hover:scale-105 transition-transform" />
                            )}
                            <span className="mt-2 text-xs truncate w-full px-1">{node.name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
