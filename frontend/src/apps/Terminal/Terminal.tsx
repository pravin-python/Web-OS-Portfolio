import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState<{ type: 'command' | 'output' | 'error'; text: string }[]>([
        { type: 'output', text: 'Web-OS Terminal emulator. Type "help" to see available commands.' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [currentPath, setCurrentPath] = useState('/home');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Try to focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputVal.trim()) {
            const cmd = inputVal.trim();
            setInputVal('');
            setHistory(prev => [...prev, { type: 'command', text: `${currentPath}$ ${cmd}` }]);

            if (cmd === 'clear') {
                setHistory([]);
                return;
            }

            try {
                const response = await api.post('/terminal/execute/', {
                    command: cmd,
                    current_path: currentPath
                });

                if (response.data.success) {
                    const output = response.data.data.output;
                    // check if output indicates a path change (simulated)
                    if (cmd.startsWith('cd ')) {
                        // Very basic simulation for UI side, real backend should return new path
                        const newPathSegment = cmd.split(' ')[1];
                        if (newPathSegment === '..') {
                            setCurrentPath(prev => prev.substring(0, prev.lastIndexOf('/')) || '/');
                        } else if (newPathSegment === '/') {
                            setCurrentPath('/');
                        } else {
                            setCurrentPath(prev => prev === '/' ? `/${newPathSegment}` : `${prev}/${newPathSegment}`);
                        }
                    }
                    setHistory(prev => [...prev, { type: 'output', text: output }]);
                } else {
                    setHistory(prev => [...prev, { type: 'error', text: response.data.message || 'Error occurred' }]);
                }
            } catch (err: any) {
                setHistory(prev => [...prev, { type: 'error', text: err.response?.data?.message || err.message || 'Connection failed' }]);
            }
        }
    };

    return (
        <div
            className="w-full h-full bg-slate-950 text-green-400 font-mono text-sm p-2 overflow-y-auto cursor-text select-text"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((entry, idx) => (
                <div
                    key={idx}
                    className={`mb-1 whitespace-pre-wrap ${entry.type === 'error' ? 'text-red-400' : ''}`}
                >
                    {entry.text}
                </div>
            ))}
            <div className="flex items-center">
                <span className="mr-2">{currentPath}$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
