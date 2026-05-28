const fs = require('fs');

// Fix TelegramBotPanel.tsx
let telegram = fs.readFileSync('src/apps/ContactCenter/TelegramBotPanel.tsx', 'utf8');
telegram = telegram.replace(/catch \(err: any\)/, 'catch (err: unknown)');
telegram = telegram.replace(/err\.message \|\|/, '(err instanceof Error && err.message) ? err.message :');
// Fix cooldownRef.current in render
telegram = telegram.replace(/disabled=\{\!isValid \|\| status \=\=\= \"sending\" \|\| cooldownRef\.current\}/g, 'disabled={!isValid || status === "sending"}');
fs.writeFileSync('src/apps/ContactCenter/TelegramBotPanel.tsx', telegram);

// Fix DatasetViewer.tsx
let dataset = fs.readFileSync('src/apps/DatasetViewer/DatasetViewer.tsx', 'utf8');
dataset = dataset.replace(/function parseJSONToCSVData\(data: any\[\]\)/, 'function parseJSONToCSVData(data: Record<string, unknown>[])');
dataset = dataset.replace(/const content = readByPath\(\(activeDataset as any\)\.path\);/, 'const content = readByPath((activeDataset as Record<string, unknown>).path as string);');
dataset = dataset.replace(/const key = \(activeDataset as any\)\.key;/, 'const key = (activeDataset as Record<string, unknown>).key as string;');
dataset = dataset.replace(/\[activeTab, activeDataset, apiDataMap\]/, '[activeDataset, apiDataMap]');
fs.writeFileSync('src/apps/DatasetViewer/DatasetViewer.tsx', dataset);

// Fix SystemLogs.tsx
let systemLogs = fs.readFileSync('src/apps/SystemLogs/SystemLogs.tsx', 'utf8');
// To avoid calling setState in effect we can initialize the state with it.
// React hook useState can take a function.
const stateReplacement = `  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = [];
    for (let i = 0; i < 12; i++) {
      const entry = generateLogEntry();
      initial.push({ ...entry, id: logId++ });
    }
    return initial;
  });`;

systemLogs = systemLogs.replace(/  const \[logs, setLogs\] \= useState\<LogEntry\[\]\>\(\[\]\);/, stateReplacement);
systemLogs = systemLogs.replace(/  \/\/ Generate initial logs[\s\S]*?\}, \[\]\);/m, '');
fs.writeFileSync('src/apps/SystemLogs/SystemLogs.tsx', systemLogs);

// Fix SystemTray.tsx
let systemTray = fs.readFileSync('src/core/taskbar/SystemTray.tsx', 'utf8');
systemTray = systemTray.replace(/catch \(e\)/g, 'catch (_e)');
fs.writeFileSync('src/core/taskbar/SystemTray.tsx', systemTray);
