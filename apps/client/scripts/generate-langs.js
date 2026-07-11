import { writeFileSync, readFileSync, readdirSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(import.meta.dirname, '..');
const LOCALES_DIR = join(ROOT_DIR, 'src', 'configs', 'i18n', 'locales');
const LANGS = ['en', 'fa'];

rmSync(LOCALES_DIR, { recursive: true, force: true });
mkdirSync(LOCALES_DIR, { recursive: true });

for (const lang of LANGS) {
    writeFileSync(join(LOCALES_DIR, `${lang}.json`), '{}');
}

function setNested(obj, path, value) {
    const keys = path.split('/');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
}

function findFiles(dir, pattern) {
    const results = [];
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            results.push(...findFiles(fullPath, pattern));
        } else if (pattern.test(entry.name)) {
            results.push(fullPath);
        }
    }

    return results;
}

async function main() {
    const stringFiles = findFiles(join(ROOT_DIR, 'src'), /^strings\.ts$|^messages\.ts$/);

    for (const file of stringFiles) {
        const mod = await import(`file://${file}`);
        const messages = mod.default || mod;

        if (!messages) continue;

        for (const entry of Object.values(messages)) {
            if (!entry?.id || !entry?.defaultMessage) continue;

            const id = entry.id.trim();
            const translations = entry.defaultMessage;

            for (const lang of LANGS) {
                const text = translations[lang] || translations.en || '';
                const finalText = typeof text === 'string' ? text.trim() : id;

                const jsonPath = join(LOCALES_DIR, `${lang}.json`);
                let data = {};

                try {
                    const content = readFileSync(jsonPath, 'utf8').trim();
                    if (content) data = JSON.parse(content);
                } catch {
                    console.log(`Error reading or parsing ${jsonPath}. Starting with an empty object.`);
                }

                data[id] = finalText;
                const nested = {};
                for (const [key, val] of Object.entries(data)) {
                    setNested(nested, key, val);
                }
                writeFileSync(jsonPath, JSON.stringify(nested, null, 2) + '\n');
            }
        }
    }
}

main();
