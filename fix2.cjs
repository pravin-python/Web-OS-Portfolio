const fs = require('fs');
let systemTray = fs.readFileSync('src/core/taskbar/SystemTray.tsx', 'utf8');
systemTray = systemTray.replace(/catch \(_e\)/g, 'catch');
fs.writeFileSync('src/core/taskbar/SystemTray.tsx', systemTray);
