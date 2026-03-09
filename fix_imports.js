import fs from 'fs';
import path from 'path';

const files = [
    'Dashboard.jsx', 'VisitorLogs.jsx', 'SecurityAlerts.jsx',
    'ResidentDirectory.jsx', 'SecurityGuards.jsx', 'EntryLogs.jsx', 'Reports.jsx'
];

files.forEach(file => {
    const filePath = path.join(process.cwd(), 'src', 'pages', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Ensure LogOut is imported cleanly
        if (!content.includes('LogOut')) {
            content = content.replace("} from 'lucide-react';", ", LogOut } from 'lucide-react';");
            content = content.replace("}, LogOut }", ", LogOut }"); // Clean up accident
            fs.writeFileSync(filePath, content);
            console.log('Fixed', file);
        } else {
            // If LogOut is there but with a syntax error like `  , LogOut} from 'lucide-react';  ` we fix it
            content = content.replace(/,\s*,\s*LogOut/g, ", LogOut");
            content = content.replace(/\}\s*,\s*LogOut/g, "}, LogOut");
            fs.writeFileSync(filePath, content);
        }
    }
});
