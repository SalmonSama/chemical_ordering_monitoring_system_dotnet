import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
    // Backgrounds
    { match: /#0f172a/gi, replace: "var(--color-bg-primary)" },
    { match: /#1e293b/gi, replace: "var(--color-bg-surface)" },
    { match: /#1e1e2d/gi, replace: "var(--color-bg-surface)" }, // Sometimes I used variation
    
    // Texts
    { match: /#f1f5f9/gi, replace: "var(--color-text-primary)" },
    { match: /#e2e8f0/gi, replace: "var(--color-text-primary)" },
    { match: /#94a3b8/gi, replace: "var(--color-text-secondary)" },
    { match: /#64748b/gi, replace: "var(--color-text-tertiary)" },
    
    // Borders
    { match: /#334155/gi, replace: "var(--color-border)" },
    { match: /#475569/gi, replace: "var(--color-border)" },
    
    // Accents & Status (Note: some of these are wrapped in string literals, so 'var(...)' is safe)
    { match: /#3b82f6/gi, replace: "var(--color-accent)" },
    { match: /#60a5fa/gi, replace: "var(--color-accent-hover)" },
    
    { match: /#34d399/gi, replace: "var(--color-success)" },
    { match: /rgba\(52, 211, 153, [0-9.]+\)/gi, replace: "var(--color-success-bg)" },
    
    { match: /#fbbf24/gi, replace: "var(--color-warning)" },
    { match: /rgba\(245, 158, 11, [0-9.]+\)/gi, replace: "var(--color-warning-bg)" },
    
    { match: /#f87171/gi, replace: "var(--color-danger)" },
    { match: /rgba\(239, 68, 68, [0-9.]+\)/gi, replace: "var(--color-danger-bg)" },
    
    { match: /rgba\(59, 130, 246, [0-9.]+\)/gi, replace: "var(--color-info-bg)" },
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { match, replace } of REPLACEMENTS) {
                if (match.test(content)) {
                    content = content.replace(match, replace);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

console.log('Starting theme migration...');
processDirectory(SRC_DIR);
console.log('Done.');
