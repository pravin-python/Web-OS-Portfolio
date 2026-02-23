/**
 * Terminal command parser/executor — writable filesystem edition.
 *
 * Supports read + write commands: mkdir, touch, write, rm, mv, cp.
 * Reads/writes to the virtual filesystem engine.
 * Saves command history to localStorage.
 */
import {
    findByPath,
    listByPath,
    readByPath,
    mkdir,
    touch,
    writeFile,
    removeNode,
    moveNode,
    copyNode,
    exportJSON,
} from './filesystem';
import { storage } from './storage';
import aboutData from '../data/about.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';

// Commands that are still blocked (require a real backend)
const BLOCKED_COMMANDS = new Set([
    'upload', 'save-to-server',
    'chmod', 'chown',
    'nano', 'vim', 'vi',
    'sed', 'awk',
    'sudo', 'su',
]);

const HISTORY_KEY = 'terminal_history';

export interface TerminalOutput {
    output: string;
    newPath?: string; // if the command changes the current path
}

/**
 * Execute a command and return output.
 */
export function executeCommand(command: string, currentPath: string): TerminalOutput {
    const parts = command.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return { output: '' };

    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Block commands that need a real backend
    if (BLOCKED_COMMANDS.has(cmd)) {
        return { output: `Permission denied: '${cmd}' is not available in this environment.` };
    }

    // Save to history
    saveHistory(command);

    switch (cmd) {
        case 'help':
            return { output: getHelpText() };
        case 'whoami':
            return { output: 'visitor' };
        case 'pwd':
            return { output: currentPath };
        case 'ls':
            return cmdLs(currentPath, args);
        case 'cd':
            return cmdCd(currentPath, args);
        case 'cat':
            return cmdCat(currentPath, args);
        case 'echo':
            return { output: args.join(' ') };
        case 'clear':
            return { output: '__CLEAR__' };
        case 'mkdir':
            return cmdMkdir(currentPath, args);
        case 'touch':
            return cmdTouch(currentPath, args);
        case 'write':
            return cmdWrite(currentPath, args);
        case 'rm':
        case 'rmdir':
            return cmdRm(currentPath, args);
        case 'mv':
            return cmdMv(currentPath, args);
        case 'cp':
            return cmdCp(currentPath, args);
        case 'about':
            return cmdAbout();
        case 'projects':
            return cmdProjects();
        case 'skills':
            return cmdSkills();
        case 'contact':
            return cmdContact();
        case 'date':
            return { output: new Date().toLocaleString() };
        case 'uname':
            return { output: 'WebOS 1.0.0 (Portfolio Edition)' };
        case 'history':
            return cmdHistory();
        case 'export':
            return cmdExport();
        case 'open':
            return { output: args.length > 0 ? `__OPEN__${args[0]}` : 'Usage: open <app_name>' };
        case 'run':
            return { output: args.length > 0 ? `__OPEN__${args[0]}` : 'Usage: run <app_name>' };
        default:
            return { output: `Command not found: ${cmd}. Type 'help' for available commands.` };
    }
}

// ─── Help ────────────────────────────────────────────────────────

function getHelpText(): string {
    return [
        'Available commands:',
        '',
        '  📂 File System',
        '  ls [path]            List directory contents',
        '  cd <dir>             Change directory',
        '  pwd                  Print working directory',
        '  cat <file>           View file contents',
        '  mkdir <name>         Create a directory',
        '  touch <name>         Create an empty file',
        '  write <file> <text>  Write content to a file',
        '  rm <name>            Remove a file or empty directory',
        '  mv <src> <dest>      Move or rename',
        '  cp <src> <dest>      Copy a file',
        '',
        '  🖥️  System',
        '  help                 Show this help message',
        '  whoami               Display current user',
        '  echo <msg>           Print a message',
        '  clear                Clear terminal',
        '  date                 Show current date/time',
        '  uname                System information',
        '  history              Command history',
        '  export               Export filesystem as JSON',
        '',
        '  📋 Portfolio',
        '  about                About the portfolio owner',
        '  projects             List projects',
        '  skills               List skills',
        '  contact              Contact information',
        '',
        '  🚀 Apps',
        '  open <app>           Open an application',
        '  run <app>            Run an application',
    ].join('\n');
}

// ─── Read Commands ───────────────────────────────────────────────

function cmdLs(currentPath: string, args: string[]): TerminalOutput {
    const targetPath = args[0] ? resolvePath(currentPath, args[0]) : currentPath;
    const nodes = listByPath(targetPath);
    if (nodes.length === 0) {
        const node = findByPath(targetPath);
        if (!node) return { output: `ls: cannot access '${args[0] || targetPath}': No such file or directory` };
        return { output: '(empty directory)' };
    }
    return {
        output: nodes.map(n =>
            n.type === 'folder' ? `📁 ${n.name}/` : `📄 ${n.name}`
        ).join('\n')
    };
}

function cmdCd(currentPath: string, args: string[]): TerminalOutput {
    if (args.length === 0 || args[0] === '~') {
        return { output: '', newPath: '/home/visitor' };
    }

    const target = args[0];
    const newPath = resolvePath(currentPath, target);
    const node = findByPath(newPath);

    if (!node) return { output: `cd: no such directory: ${target}` };
    if (node.type !== 'folder') return { output: `cd: not a directory: ${target}` };

    return { output: '', newPath };
}

function cmdCat(currentPath: string, args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: cat <filename>' };

    const filePath = resolvePath(currentPath, args[0]);
    const content = readByPath(filePath);

    if (content === null) {
        return { output: `cat: ${args[0]}: No such file` };
    }
    return { output: content || '(empty file)' };
}

// ─── Write Commands ──────────────────────────────────────────────

function cmdMkdir(currentPath: string, args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: mkdir <directory_name>' };
    const result = mkdir(currentPath, args[0]);
    return { output: result.ok ? result.message : result.error };
}

function cmdTouch(currentPath: string, args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: touch <filename>' };
    const result = touch(currentPath, args[0]);
    return { output: result.ok ? result.message : result.error };
}

function cmdWrite(currentPath: string, args: string[]): TerminalOutput {
    if (args.length < 2) return { output: 'Usage: write <filename> <content>' };
    const fileName = args[0];
    const content = args.slice(1).join(' ');
    const result = writeFile(currentPath, fileName, content);
    return { output: result.ok ? result.message : result.error };
}

function cmdRm(currentPath: string, args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: rm <name>' };
    const result = removeNode(currentPath, args[0]);
    return { output: result.ok ? result.message : result.error };
}

function cmdMv(currentPath: string, args: string[]): TerminalOutput {
    if (args.length < 2) return { output: 'Usage: mv <source> <destination>' };
    const result = moveNode(currentPath, args[0], args[1]);
    return { output: result.ok ? result.message : result.error };
}

function cmdCp(currentPath: string, args: string[]): TerminalOutput {
    if (args.length < 2) return { output: 'Usage: cp <source> <destination>' };
    const result = copyNode(currentPath, args[0], args[1]);
    return { output: result.ok ? result.message : result.error };
}

function cmdExport(): TerminalOutput {
    const json = exportJSON();
    // Try to copy to clipboard
    try {
        navigator.clipboard.writeText(json);
        return { output: 'Filesystem exported to clipboard as JSON.' };
    } catch {
        return { output: 'Filesystem JSON:\n' + json };
    }
}

// ─── Portfolio Commands ──────────────────────────────────────────

function cmdAbout(): TerminalOutput {
    return {
        output: [
            `👤 ${aboutData.name} — ${aboutData.title}`,
            '',
            aboutData.bio,
            '',
            '📍 ' + aboutData.location,
            '📧 ' + aboutData.email,
            '',
            ...aboutData.highlights.map(h => `  • ${h}`)
        ].join('\n')
    };
}

function cmdProjects(): TerminalOutput {
    return {
        output: projectsData.map((p, i) =>
            `${i + 1}. ${p.title} [${p.category}]\n   ${p.description}\n   Tech: ${p.techStack.join(', ')}`
        ).join('\n\n')
    };
}

function cmdSkills(): TerminalOutput {
    return {
        output: skillsData.categories.map(cat =>
            `${cat.name}: ${cat.skills.join(', ')}`
        ).join('\n')
    };
}

function cmdContact(): TerminalOutput {
    return {
        output: [
            `📧 Email: ${aboutData.email}`,
            `🐙 GitHub: ${aboutData.socialLinks.github}`,
            `💼 LinkedIn: ${aboutData.socialLinks.linkedin}`,
            `🐦 Twitter: ${aboutData.socialLinks.twitter}`,
        ].join('\n')
    };
}

// ─── History ─────────────────────────────────────────────────────

function cmdHistory(): TerminalOutput {
    const history = storage.get<string[]>(HISTORY_KEY, []);
    if (!history || history.length === 0) return { output: '(no history)' };
    return {
        output: history.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n')
    };
}

function saveHistory(command: string): void {
    const history = storage.get<string[]>(HISTORY_KEY, []) ?? [];
    history.push(command);
    if (history.length > 100) history.splice(0, history.length - 100);
    storage.set(HISTORY_KEY, history);
}

// ─── Path Utilities ──────────────────────────────────────────────

function resolvePath(currentPath: string, target: string): string {
    if (target.startsWith('/')) return normalizePath(target);
    const parts = currentPath.split('/').filter(Boolean);
    for (const segment of target.split('/')) {
        if (segment === '..') {
            parts.pop();
        } else if (segment !== '.' && segment !== '') {
            parts.push(segment);
        }
    }
    return '/' + parts.join('/');
}

function normalizePath(path: string): string {
    const parts = path.split('/').filter(Boolean);
    const result: string[] = [];
    for (const part of parts) {
        if (part === '..') result.pop();
        else if (part !== '.') result.push(part);
    }
    return '/' + result.join('/');
}
