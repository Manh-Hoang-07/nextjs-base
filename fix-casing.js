const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const rootDir = path.join(__dirname, 'src');

walk(rootDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Replacement: change /shared/Admin/ to /shared/admin/
        // And also /Shared/ to /shared/ just in case
        newContent = newContent.replace(/@\/components\/shared\/Admin\//g, '@/components/shared/admin/');
        newContent = newContent.replace(/@\/components\/Shared\/admin\//g, '@/components/shared/admin/');
        newContent = newContent.replace(/@\/components\/Shared\/Admin\//g, '@/components/shared/admin/');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
