import React, { useEffect, useRef, useState } from 'react';
import { useWindowStore, type WindowInstance } from '../../core/state/useWindowStore';

const GRID_SIZE = 20;

export const SnakeGame: React.FC<{ window: WindowInstance }> = ({ window }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const focusedWindowId = useWindowStore(state => state.focusedWindowId);

    // Game state refs (to avoid stale closures in RAF)
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const dirRef = useRef({ dx: 1, dy: 0 });
    const lastUpdateRef = useRef(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Only run when focused and not minimized
        if (focusedWindowId !== window.id || window.isMinimized || gameOver) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const gameLoop = (timestamp: number) => {
            // Limit speed
            if (timestamp - lastUpdateRef.current > 100) {
                lastUpdateRef.current = timestamp;

                let snake = [...snakeRef.current];
                const head = { x: snake[0].x + dirRef.current.dx, y: snake[0].y + dirRef.current.dy };

                // Wall collision
                if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
                    setGameOver(true);
                    return;
                }

                // Self collision
                if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true);
                    return;
                }

                snake.unshift(head);

                // Food collision
                if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                    setScore(s => s + 10);
                    foodRef.current = {
                        x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)),
                        y: Math.floor(Math.random() * (canvas.height / GRID_SIZE)),
                    };
                } else {
                    snake.pop();
                }

                snakeRef.current = snake;

                // Render phase
                // Background
                ctx.fillStyle = '#1e293b'; // slate-800
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Food
                ctx.fillStyle = '#ef4444'; // red-500
                ctx.beginPath();
                ctx.arc(
                    foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
                    foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
                    GRID_SIZE / 2 - 2, 0, 2 * Math.PI
                );
                ctx.fill();

                // Snake
                ctx.fillStyle = '#22c55e'; // green-500
                snake.forEach((segment, i) => {
                    ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
                    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
                });
            }

            if (!gameOver) {
                rafRef.current = requestAnimationFrame(gameLoop);
            }
        };

        rafRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [focusedWindowId, window.id, window.isMinimized, gameOver]);

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (focusedWindowId !== window.id) return;

            const dir = dirRef.current;
            switch (e.key) {
                case 'ArrowUp': if (dir.dy !== 1) dirRef.current = { dx: 0, dy: -1 }; break;
                case 'ArrowDown': if (dir.dy !== -1) dirRef.current = { dx: 0, dy: 1 }; break;
                case 'ArrowLeft': if (dir.dx !== 1) dirRef.current = { dx: -1, dy: 0 }; break;
                case 'ArrowRight': if (dir.dx !== -1) dirRef.current = { dx: 1, dy: 0 }; break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [focusedWindowId, window.id]);

    const restart = () => {
        snakeRef.current = [{ x: 10, y: 10 }];
        dirRef.current = { dx: 1, dy: 0 };
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-t border-slate-700/50">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-800 text-white font-mono text-sm border-b border-slate-700">
                <span>Score: {score}</span>
                {focusedWindowId !== window.id && <span className="text-yellow-400 text-xs">PAUSED (Click to focus)</span>}
            </div>
            <div className="flex-1 relative flex items-center justify-center bg-slate-900 min-h-0">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="border border-slate-700 shadow-xl bg-slate-800 max-h-full aspect-square"
                    style={{ width: 'auto', height: '100%' }}
                />
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-bold text-white mb-2 font-mono">Game Over!</h2>
                        <p className="text-green-400 font-mono mb-6">Final Score: {score}</p>
                        <button
                            onClick={restart}
                            className="px-6 py-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded shadow-lg font-mono transition-transform active:scale-95"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
