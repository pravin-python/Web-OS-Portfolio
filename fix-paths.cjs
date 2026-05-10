const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // For JSX strings like src="/svg/something.svg" -> src={`${import.meta.env.BASE_URL}svg/something.svg`}
    const jsxRegex = /(src|icon)=["']\/(svg|image)\/([^"']+)["']/g;
    if (jsxRegex.test(content)) {
        content = content.replace(jsxRegex, '$1={`${import.meta.env.BASE_URL}$2/$3`}');
        changed = true;
    }

    // For Object properties like icon: "/svg/something" -> icon: import.meta.env.BASE_URL + "svg/something"
    const objRegex = /:\s*["']\/(svg|image)\/([^"']+)["']/g;
    if (objRegex.test(content)) {
        content = content.replace(objRegex, ': import.meta.env.BASE_URL + "$1/$2"');
        changed = true;
    }

    // For variables like photoUrl = "/image/..." -> photoUrl = import.meta.env.BASE_URL + "image/..."
    const varRegex = /=\s*["']\/(svg|image)\/([^"']+)["']/g;
    if (varRegex.test(content)) {
        content = content.replace(varRegex, '= import.meta.env.BASE_URL + "$1/$2"');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
