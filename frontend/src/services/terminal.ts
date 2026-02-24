/**
 * Terminal command parser/executor — AI Research Workstation edition.
 *
 * Supports: filesystem, AI commands, security commands, portfolio info.
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
import { getModelInfo } from './aiService';
import { analyzePassword } from './securityService';
import aboutData from '../data/about.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';

const BLOCKED_COMMANDS = new Set([
    'upload', 'save-to-server', 'chmod', 'chown',
    'nano', 'vim', 'vi', 'sed', 'awk', 'sudo', 'su',
]);

const HISTORY_KEY = 'terminal_history';

export interface TerminalOutput {
    output: string;
    newPath?: string;
    isAsync?: boolean; // if command returns output over time
}

export function executeCommand(command: string, currentPath: string): TerminalOutput {
    const parts = command.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return { output: '' };

    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (BLOCKED_COMMANDS.has(cmd)) {
        return { output: `Permission denied: '${cmd}' is not available in this environment.` };
    }

    saveHistory(command);

    // Multi-word commands
    const fullCmd = parts.slice(0, 2).join(' ').toLowerCase();

    switch (fullCmd) {
        case 'model info':
            return { output: getModelInfo() };
        case 'train model':
            return cmdTrainModel();
        case 'predict sample':
            return cmdPredictSample();
        case 'scan invoice':
            return cmdScanInvoice();
        case 'analyze dataset':
            return cmdAnalyzeDataset();
        case 'scan url':
            return cmdScanUrl(parts.slice(2));
    }

    switch (cmd) {
        case 'help':
            return { output: getHelpText() };
        case 'whoami':
            return { output: 'pravin-prajapati' };
        case 'hostname':
            return { output: 'pravin-research-station' };
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
            return { output: 'ResearchOS 2.0.0 (Pravin-AI Workstation Edition)' };
        case 'history':
            return cmdHistory();
        case 'export':
            return cmdExport();
        case 'hash':
            return cmdHash(args);
        case 'password':
            return cmdPassword(args);
        case 'model':
            return { output: 'Usage: model info' };
        case 'train':
            return { output: 'Usage: train model' };
        case 'predict':
            return { output: 'Usage: predict sample' };
        case 'scan':
            return { output: 'Usage: scan invoice | scan url <url>' };
        case 'analyze':
            return { output: 'Usage: analyze dataset' };
        case 'open':
        case 'run':
            return { output: args.length > 0 ? `__OPEN__${args[0]}` : 'Usage: open <app_name>' };
        case 'neofetch':
            return cmdNeofetch();
        default:
            return { output: `Command not found: ${cmd}. Type 'help' for available commands.` };
    }
}

// ─── Help ────────────────────────────────────────────────────────

function getHelpText(): string {
    return [
        '┌─────────────────────────────────────┐',
        '│   Research Station — Command Help    │',
        '└─────────────────────────────────────┘',
        '',
        '  📂 File System',
        '  ls [path]            List directory contents',
        '  cd <dir>             Change directory',
        '  pwd                  Print working directory',
        '  cat <file>           View file contents',
        '  mkdir / touch / write / rm / mv / cp',
        '',
        '  🤖 AI Commands',
        '  model info           Show model details',
        '  train model          Train neural network',
        '  predict sample       Run inference',
        '  scan invoice         Extract invoice data',
        '  analyze dataset      Dataset statistics',
        '',
        '  🔐 Security',
        '  hash <text>          Generate MD5/SHA256',
        '  password <pw>        Analyze password strength',
        '  scan url <url>       Phishing URL analysis',
        '',
        '  🖥️  System',
        '  whoami / hostname / date / uname',
        '  neofetch             System info',
        '  history / clear / export',
        '',
        '  📋 Portfolio',
        '  about / projects / skills / contact',
        '',
        '  🚀 Apps',
        '  open <app>           Open an application',
    ].join('\n');
}

// ─── AI Commands ─────────────────────────────────────────────────

function cmdTrainModel(): TerminalOutput {
    return {
        output: [
            'Loading dataset...',
            'Preprocessing data (18,000 samples)...',
            'Initializing model: InvoiceExtractor-v4',
            'Starting training (5 epochs)...',
            '',
            '  Epoch 1/5 | loss: 0.3142 | acc: 86.2% | lr: 2.70e-4',
            '  Epoch 2/5 | loss: 0.2518 | acc: 88.9% | lr: 2.43e-4',
            '  Epoch 3/5 | loss: 0.1893 | acc: 91.4% | lr: 2.19e-4',
            '  Epoch 4/5 | loss: 0.1247 | acc: 93.2% | lr: 1.97e-4',
            '  Epoch 5/5 | loss: 0.0891 | acc: 94.1% | lr: 1.77e-4',
            '',
            'Training complete!',
            'Final Accuracy: 94.1%',
            'Model saved to /ai_lab/model_v4.pth',
        ].join('\n'),
    };
}

function cmdPredictSample(): TerminalOutput {
    return {
        output: [
            'Loading model: InvoiceExtractor-v3...',
            'Preprocessing input image...',
            'Running inference...',
            '',
            '┌────────────────────────────────┐',
            '│  PREDICTION RESULT             │',
            '├────────────────────────────────┤',
            '│  Document: Invoice             │',
            '│  Invoice No: INV-1024          │',
            '│  Vendor: Acme Corp             │',
            '│  Total: ₹12,480               │',
            '│  Date: 2024-11-15              │',
            '│  Confidence: 93.4%             │',
            '└────────────────────────────────┘',
        ].join('\n'),
    };
}

function cmdScanInvoice(): TerminalOutput {
    return {
        output: [
            'Loading OCR Engine v2.1...',
            'Preprocessing: grayscale → threshold → deskew',
            'Detecting text regions (EAST detector)...',
            'Running Tesseract OCR...',
            'Extracting entities (NER)...',
            '',
            '┌────────────────────────────────────┐',
            '│  INVOICE EXTRACTION RESULT         │',
            '├────────────────────────────────────┤',
            '│  Vendor:     TechFlow Solutions     │',
            '│  Invoice:    INV-1025               │',
            '│  Date:       2024-11-18             │',
            '│  Subtotal:   ₹38,305               │',
            '│  Tax (18%):  ₹6,895                │',
            '│  Total:      ₹45,200               │',
            '│  Fields:     7 extracted            │',
            '│  Confidence: 91.2%                  │',
            '└────────────────────────────────────┘',
        ].join('\n'),
    };
}

function cmdAnalyzeDataset(): TerminalOutput {
    const csv = readByPath('/home/researcher/datasets/invoices_dataset.csv');
    if (!csv) return { output: 'Error: dataset not found.' };

    const lines = csv.split('\n').filter(l => l.trim());
    const rows = lines.length - 1;
    const headers = lines[0].split(',');

    return {
        output: [
            `Dataset: invoices_dataset.csv`,
            `Rows: ${rows}`,
            `Columns: ${headers.length} (${headers.join(', ')})`,
            '',
            `Status breakdown:`,
            `  processed: ${lines.filter(l => l.includes('processed')).length}`,
            `  pending: ${lines.filter(l => l.includes('pending')).length}`,
            `  failed: ${lines.filter(l => l.includes('failed')).length}`,
            '',
            `Avg confidence: 0.90`,
            `Min confidence: 0.42 (INV-1007)`,
            `Max confidence: 0.97 (INV-1011)`,
        ].join('\n'),
    };
}

// ─── Security Commands ───────────────────────────────────────────

function cmdHash(args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: hash <text>' };
    const text = args.join(' ');
    // Simple synchronous hash for terminal (not crypto-grade)
    let h = 0;
    for (let i = 0; i < text.length; i++) {
        h = ((h << 5) - h) + text.charCodeAt(i);
        h |= 0;
    }
    const hex = Math.abs(h).toString(16).padStart(8, '0');
    const pseudo = (hex + hex.split('').reverse().join('') + hex + hex).slice(0, 32);

    return {
        output: [
            `Input: "${text}"`,
            '',
            `MD5:    ${pseudo}`,
            `SHA1:   ${pseudo}${hex.slice(0, 8)}`,
            `SHA256: ${pseudo}${pseudo}`,
        ].join('\n'),
    };
}

function cmdPassword(args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: password <password>' };
    const pw = args.join(' ');
    const result = analyzePassword(pw);

    return {
        output: [
            `Password Analysis: "${pw}"`,
            '',
            `  Strength:   ${result.strength}`,
            `  Score:      ${result.score}/100`,
            `  Entropy:    ${result.entropy} bits`,
            `  Crack Time: ${result.crackTime}`,
            '',
            `  Issues:`,
            ...result.reasons.map(r => `    • ${r}`),
        ].join('\n'),
    };
}

function cmdScanUrl(args: string[]): TerminalOutput {
    if (args.length === 0) return { output: 'Usage: scan url <url>' };
    const url = args[0];
    const lower = url.toLowerCase();

    // Synchronous inline analysis for terminal
    const reasons: string[] = [];
    let score = 0;

    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz'];
    for (const tld of suspiciousTLDs) {
        if (lower.endsWith(tld) || lower.includes(tld + '/')) {
            score += 40; reasons.push(`Suspicious TLD: ${tld}`); break;
        }
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
        score += 25; reasons.push('Uses raw IP address');
    }
    if (!url.startsWith('https://')) {
        score += 20; reasons.push('No HTTPS encryption');
    }
    if (/login|verify|secure|account|update|confirm|suspend/i.test(lower)) {
        score += 15; reasons.push('Suspicious keywords in domain');
    }
    const hostname = lower.replace(/https?:\/\//, '').split('/')[0];
    if (hostname.split('.').length > 3) {
        score += 10; reasons.push('Excessive subdomains');
    }
    score = Math.min(100, score);
    const level = score >= 70 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';
    if (reasons.length === 0) reasons.push('No suspicious patterns detected');

    return {
        output: [
            `Scanning URL: ${url}`,
            'Resolving DNS...',
            'Checking SSL certificate...',
            'Querying WHOIS...',
            'Scanning VirusTotal database...',
            '',
            `Risk Level: ${level}`,
            `Risk Score: ${score}/100`,
            '',
            'Findings:',
            ...reasons.map(r => `  • ${r}`),
        ].join('\n'),
    };
}

function cmdNeofetch(): TerminalOutput {
    return {
        output: [
            '        ╔═══╗        researcher@research-station',
            '       ║ R S ║       ─────────────────────────────',
            '        ╚═══╝        OS: ResearchOS 2.0.0',
            '    ┌──────────┐     Kernel: WebOS-AI-v2',
            '    │  ◉    ◉  │     Shell: Terminal v2.0',
            '    │    ──    │     CPU: Neural Engine v3',
            '    │  ╲____╱  │     GPU: CUDA Sim 12.0',
            '    └──────────┘     Memory: 16GB DDR5',
            '                     Disk: 256GB SSD',
            '                     Uptime: since boot',
            `                     Date: ${new Date().toLocaleString()}`,
            '',
            '    ███ ███ ███ ███  Tools: PyTorch, OpenCV, nmap',
        ].join('\n'),
    };
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
        return { output: '', newPath: '/home/researcher' };
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
