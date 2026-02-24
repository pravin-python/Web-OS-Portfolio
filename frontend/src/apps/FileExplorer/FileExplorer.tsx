import React, { useState, useMemo } from 'react';
import { Folder, File, ArrowLeft, RefreshCw } from 'lucide-react';
import { listChildren, getNodePath, getFileContent } from '../../services/filesystem';
import type { FileNode } from '../../services/filesystem';

export const FileExplorer: React.FC = () => {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>('root');
    const [historyStack, setHistoryStack] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

    const nodes = useMemo(() => listChildren(currentFolderId), [currentFolderId]);

    const breadcrumb = useMemo(() => {
        if (!currentFolderId) return [];
        return getNodePath(currentFolderId);
    }, [currentFolderId]);

    const navigateTo = (folderId: string) => {
        if (currentFolderId) {
            setHistoryStack(prev => [...prev, currentFolderId]);
        }
        setCurrentFolderId(folderId);
        setSelectedFile(null);
    };

    const goBack = () => {
        if (historyStack.length > 0) {
            const newHistory = [...historyStack];
            const prev = newHistory.pop()!;
            setHistoryStack(newHistory);
            setCurrentFolderId(prev);
            setSelectedFile(null);
        }
    };

    const handleDoubleClick = (node: FileNode) => {
        if (node.type === 'folder') {
            navigateTo(node.id);
        } else {
            // Show file content
            setSelectedFile(node);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-transparent">
            {/* Top action bar */}
            <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={goBack}
                    disabled={historyStack.length === 0}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={() => { setCurrentFolderId(currentFolderId); setSelectedFile(null); }}
                    className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <RefreshCw size={16} />
                </button>
                <div className="flex-1 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-sm text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                    {breadcrumb.map((node, i) => (
                        <span key={node.id} className="flex items-center">
                            {i > 0 && <span className="mx-1 text-slate-400">/</span>}
                            <button
                                onClick={() => navigateTo(node.id)}
                                className="hover:text-blue-500 transition-colors"
                            >
                                {node.name === '/' ? '🖥️ Root' : node.name}
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* File content viewer (overlay) */}
            {selectedFile && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center space-x-2">
                            <File size={14} />
                            <span>{selectedFile.name}</span>
                        </span>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            ← Back to folder
                        </button>
                    </div>
                    <pre className="flex-1 p-4 overflow-auto text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-mono bg-white dark:bg-slate-900">
                        {getFileContent(selectedFile.id) || '(empty file)'}
                    </pre>
                </div>
            )}

            {/* Main content grid */}
            {!selectedFile && (
                <div className="flex-1 p-4 overflow-y-auto w-full flex content-start flex-wrap gap-4">
                    {nodes.length === 0 ? (
                        <div className="w-full text-center py-10 opacity-50 text-sm">Empty folder</div>
                    ) : (
                        nodes.map(node => (
                            <div
                                key={node.id}
                                className="w-24 flex flex-col items-center justify-start p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer text-center group transition-colors"
                                onDoubleClick={() => handleDoubleClick(node)}
                            >
                                {node.type === 'folder' ? (
                                    <Folder size={40} className="text-yellow-400 group-hover:scale-105 transition-transform" fill="currentColor" />
                                ) : (
                                    <File size={40} className="text-blue-400 group-hover:scale-105 transition-transform" />
                                )}
                                <span className="mt-2 text-xs truncate w-full px-1 text-slate-700 dark:text-slate-300">{node.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
