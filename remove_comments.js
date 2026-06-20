const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
        fs.readdirSync(filePath).forEach(file => processFile(path.join(filePath, file)));
    } else if (filePath.match(/\.(js|jsx|css)$/)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let lines = content.split('\n');
        let modified = false;
        
        let newLines = lines.map(line => {
            let replaced = line.replace(/(?<!:)\/\/.*/, '');
            if (replaced !== line) {
                modified = true;
                return replaced;
            }
            return line;
        });

        if (modified) {
            fs.writeFileSync(filePath, newLines.join('\n'));
            console.log(`Updated ${filePath}`);
        }
    }
}

processFile(path.join(__dirname, 'src'));
console.log('Done!');
