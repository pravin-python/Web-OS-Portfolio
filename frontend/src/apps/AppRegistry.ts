import { Terminal } from './Terminal/Terminal';
import { FileExplorer } from './FileExplorer/FileExplorer';
import { Notepad } from './Notepad/Notepad';
import { TicTacToe } from './TicTacToe/TicTacToe';
import { SnakeGame } from './SnakeGame/SnakeGame';

export const AppRegistry: Record<string, any> = {
    // Map app names to React components
    fileExplorer: FileExplorer,
    terminal: Terminal,
    notepad: Notepad,
    snake: SnakeGame,
    tictactoe: TicTacToe,
    settings: () => <div>Settings Content - UI Customization Here</div>,
};
