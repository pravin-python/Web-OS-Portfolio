const fs = require('fs');
let test = fs.readFileSync('src/tests/dataService.test.ts', 'utf8');
test = test.replace(/import \{ searchData, CSVData \}/, 'import { searchData, type CSVData }');
fs.writeFileSync('src/tests/dataService.test.ts', test);
