import React from 'react';
import './styles.css';
import { useTicTacToe } from './useTicTacToe';
import { Board } from './Board';
import { ScorePanel } from './ScorePanel';
import { GameControls } from './GameControls';
import { GameOverlay } from './GameOverlay';

export const TicTacToe: React.FC = () => {
    const game = useTicTacToe();

    // Turn indicator text
    let turnText = '';
    if (game.gameStatus === 'playing') {
        if (game.aiThinking) {
            turnText = 'AI is thinking';
        } else if (game.mode === 'single') {
            turnText = game.currentPlayer === game.playerSymbol
                ? 'Your Turn'
                : 'AI Turn';
        } else {
            turnText = `Player ${game.currentPlayer}'s Turn`;
        }
    }

    const boardDisabled = game.gameStatus !== 'playing' || game.aiThinking;

    return (
        <div className="flex flex-col items-center h-full w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-y-auto select-none">
            {/* ── Notifications ─────────────────────────────── */}
            <div className="fixed top-4 right-4 z-[20000] flex flex-col space-y-2 pointer-events-none">
                {game.notifications.map(n => (
                    <div
                        key={n.id}
                        className={`ttt-notif pointer-events-auto px-4 py-2 rounded-lg shadow-lg text-sm font-medium backdrop-blur-md border ${n.type === 'success'
                                ? 'bg-green-500/90 text-white border-green-400/50'
                                : n.type === 'warning'
                                    ? 'bg-orange-500/90 text-white border-orange-400/50'
                                    : 'bg-indigo-500/90 text-white border-indigo-400/50'
                            }`}
                    >
                        {n.text}
                    </div>
                ))}
            </div>

            {/* ── Turn Indicator ────────────────────────────── */}
            <div className="mt-5 mb-3 h-8 flex items-center justify-center">
                {game.gameStatus === 'playing' && (
                    <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                        {game.aiThinking ? (
                            <>
                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{turnText}</span>
                                <span className="flex space-x-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ttt-dot-1" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ttt-dot-2" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ttt-dot-3" />
                                </span>
                            </>
                        ) : (
                            <>
                                <div className={`w-3 h-3 rounded-full ${game.currentPlayer === 'X' ? 'bg-blue-500' : 'bg-rose-500'
                                    }`} />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{turnText}</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ── Board + Overlay ───────────────────────────── */}
            <div className="relative mb-4">
                <Board
                    board={game.board}
                    winResult={game.winResult}
                    disabled={boardDisabled}
                    onCellClick={game.humanMove}
                />
                <GameOverlay
                    gameStatus={game.gameStatus}
                    winResult={game.winResult}
                    mode={game.mode}
                    playerSymbol={game.playerSymbol}
                    onPlayAgain={game.newGame}
                />
            </div>

            {/* ── Scores ────────────────────────────────────── */}
            <ScorePanel
                scores={game.scores}
                mode={game.mode}
                playerSymbol={game.playerSymbol}
            />

            {/* ── Controls ──────────────────────────────────── */}
            <div className="mt-3 mb-5 w-full px-6">
                <GameControls
                    mode={game.mode}
                    difficulty={game.difficulty}
                    playerSymbol={game.playerSymbol}
                    onModeChange={game.setMode}
                    onDifficultyChange={game.setDifficulty}
                    onSymbolChange={game.setPlayerSymbol}
                    onNewGame={game.newGame}
                    onResetScore={game.resetScore}
                />
            </div>
        </div>
    );
};
