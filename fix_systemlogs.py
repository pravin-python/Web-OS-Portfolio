import re

with open("src/apps/SystemLogs/SystemLogs.tsx", "r") as f:
    content = f.read()

# Replace the initial logs useEffect with a useState initializer
old_use_state = "const [logs, setLogs] = useState<LogEntry[]>([]);"
new_use_state = """const [logs, setLogs] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = [];
    for (let i = 0; i < 12; i++) {
      const entry = generateLogEntry();
      initial.push({ ...entry, id: logId++ });
    }
    return initial;
  });"""

content = content.replace(old_use_state, new_use_state)

# Remove the useEffect
old_use_effect = """  // Generate initial logs
  useEffect(() => {
    const initial: LogEntry[] = [];
    for (let i = 0; i < 12; i++) {
      const entry = generateLogEntry();
      initial.push({ ...entry, id: logId++ });
    }
    setLogs(initial);
  }, []);"""

content = content.replace(old_use_effect, "")

with open("src/apps/SystemLogs/SystemLogs.tsx", "w") as f:
    f.write(content)
