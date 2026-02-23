import React, { useState, useRef, useEffect, useCallback } from 'react';
import { executeCommand } from '../../services/terminal';
import { resolveAppAlias } from '../../core/appLauncher';
import { launchApp } from '../../core/appLauncher';

export const Terminal: React.FC = () => {
    const [history, setHistory] = useState<{ type: 'command' | 'output' | 'error'; text: string }[]>([
        { type: 'output', text: 'Web-OS Terminal emulator. Type "help" to see available commands.' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [currentPath, setCurrentPath] = useState('/home/visitor');
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [history, scrollToBottom]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIdx = cmdHistoryIdx < cmdHistory.length - 1 ? cmdHistoryIdx + 1 : cmdHistoryIdx;
                setCmdHistoryIdx(newIdx);
                setInputVal(cmdHistory[cmdHistory.length - 1 - newIdx] || '');
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIdx = cmdHistoryIdx > 0 ? cmdHistoryIdx - 1 : -1;
            setCmdHistoryIdx(newIdx);
            setInputVal(newIdx >= 0 ? (cmdHistory[cmdHistory.length - 1 - newIdx] || '') : '');
            return;
        }

        if (e.key === 'Enter' && inputVal.trim()) {
            const cmd = inputVal.trim();
            setInputVal('');
            setCmdHistory(prev => [...prev, cmd]);
            setCmdHistoryIdx(-1);

            setHistory(prev => [...prev, { type: 'command', text: `${currentPath}$ ${cmd}` }]);

            const result = executeCommand(cmd, currentPath);

            if (result.output === '__CLEAR__') {
                setHistory([]);
                return;
            }

            if (result.output.startsWith('__OPEN__')) {
                const appName = result.output.replace('__OPEN__', '');
                const appKey = resolveAppAlias(appName);
                if (appKey) {
                    launchApp(appKey);
                    setHistory(prev => [...prev, { type: 'output', text: `Launching ${appName}...` }]);
                } else {
                    setHistory(prev => [...prev, { type: 'error', text: `Unknown application: ${appName}` }]);
                }
                return;
            }

            if (result.newPath) {
                setCurrentPath(result.newPath);
            }

            if (result.output) {
                setHistory(prev => [...prev, { type: 'output', text: result.output }]);
            }
        }
    };

    return (
        <div
            ref={scrollRef}
            className="h-full w-full overflow-y-auto bg-slate-950 text-green-400 font-mono text-sm p-3 cursor-text select-text"
            onClick={focusInput}
        >
            {history.map((entry, idx) => (
                <div
                    key={idx}
                    className={`mb-1 whitespace-pre-wrap break-words ${entry.type === 'error' ? 'text-red-400' :
                            entry.type === 'command' ? 'text-cyan-300' : ''
                        }`}
                >
                    {entry.text}
                </div>
            ))}
            <div className="flex items-center">
                <span className="mr-2 text-cyan-400 whitespace-nowrap flex-shrink-0">{currentPath}$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0 min-w-0"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};
