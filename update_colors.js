import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const replaceRules = [
    { from: /#2F6BFF/gi, to: '#FF5C2A' },
    { from: /47,\s*107,\s*255/g, to: '255, 92, 42' },
    { from: /#EFF6FF/gi, to: '#FFF5F2' },
    { from: /#DBEAFE/gi, to: '#FDD8CF' },
    { from: /#1E4FCC/gi, to: '#E64B20' },
    { from: /#4F8CFF/gi, to: '#FF855E' },
    { from: /#00B1FF/gi, to: '#FF8059' },
    { from: /#3B82F6/gi, to: '#FF5C2A' },
    { from: /#2563eb/gi, to: '#FF5C2A' },
    { from: /#526ed3/gi, to: '#E64B20' },
    { from: /#f5f7ff/gi, to: '#FFF5F2' },
    { from: /rgba\(59,\s*130,\s*246/g, to: 'rgba(255, 92, 42' }
];

function walkSync(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let filepath = path.join(dir, file);
        let stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walkSync(filepath, callback);
        } else {
            callback(filepath);
        }
    });
}

walkSync('src', (filepath) => {
    if (filepath.endsWith('.css') || filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
        let content = fs.readFileSync(filepath, 'utf8');
        let newContent = content;
        for (let rule of replaceRules) {
            newContent = newContent.replace(rule.from, rule.to);
        }
        if (content !== newContent) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log('Updated ' + filepath);
        }
    }
});
