import React from 'react';
import type { TileData } from './gameEngine';
import { BOARD_SIZE } from './gameEngine';

interface BoardProps {
    tiles: TileData[];
}

/*
 * Layout math (percentage-based for responsiveness):
 *   The board has padding = 2% on all sides.
 *   The tiles-container sits inside that padding (absolute inset matching board padding).
 *   Inside the tiles-container, each cell is:
 *     cellSize = (100 - gap*(N+1)) / N  where gap ≈ 2.5%
 *   Position of cell (r, c):
 *     left = gap + c * (cellSize + gap)
 *     top  = gap + r * (cellSize + gap)
 */

const GAP = 2.5; // % gap
const CELL_SIZE = (100 - GAP * (BOARD_SIZE + 1)) / BOARD_SIZE; // ≈ 21.875%

function cellLeft(col: number): number {
    return GAP + col * (CELL_SIZE + GAP);
}

function cellTop(row: number): number {
    return GAP + row * (CELL_SIZE + GAP);
}

/**
 * Renders the 4×4 grid background and positions tiles absolutely with left/top.
 */
export const Board: React.FC<BoardProps> = React.memo(({ tiles }) => {

    function tileClass(tile: TileData): string {
        const base = 'game2048-tile';
        const valClass = tile.value <= 2048 ? `tile-${tile.value}` : 'tile-super';
        const animClass = tile.isNew ? 'tile-new' : tile.mergedFrom ? 'tile-merged' : '';
        return `${base} ${valClass} ${animClass}`;
    }

    function tileFontSize(value: number): string {
        if (value >= 10000) return 'clamp(14px, 3vw, 22px)';
        if (value >= 1000) return 'clamp(16px, 3.5vw, 26px)';
        if (value >= 100) return 'clamp(18px, 4vw, 30px)';
        return 'clamp(22px, 5vw, 38px)';
    }

    return (
        <div className="game2048-board">
            {/* Background grid cells */}
            <div className="game2048-grid">
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => (
                    <div key={i} className="game2048-cell" />
                ))}
            </div>

            {/* Animated tiles layer */}
            <div className="game2048-tiles-container">
                {tiles.map(tile => {
                    const left = cellLeft(tile.col);
                    const top = cellTop(tile.row);
                    return (
                        <div
                            key={tile.id}
                            className={tileClass(tile)}
                            style={{
                                width: `${CELL_SIZE}%`,
                                height: `${CELL_SIZE}%`,
                                left: `${left}%`,
                                top: `${top}%`,
                                fontSize: tileFontSize(tile.value),
                            }}
                        >
                            {tile.value}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

Board.displayName = 'Board';
