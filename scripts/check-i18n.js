const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
    console.error('No translation files found in locales/ directory.');
    process.exit(1);
}

// Read English as primary reference
const referenceFile = 'en.json';
if (!files.includes(referenceFile)) {
    console.error('en.json is required as the default reference file.');
    process.exit(1);
}

function getFlattenedKeys(obj, prefix = '') {
    let keys = {};
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(keys, getFlattenedKeys(obj[key], fullKey));
        } else {
            keys[fullKey] = true;
        }
    }
    return keys;
}

const referencePath = path.join(localesDir, referenceFile);
const referenceContent = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
const referenceKeys = getFlattenedKeys(referenceContent);
const referenceKeysCount = Object.keys(referenceKeys).length;

console.log(`Reference language: English (en.json) with ${referenceKeysCount} keys.`);

let exitCode = 0;

for (const file of files) {
    if (file === referenceFile) continue;
    
    try {
        const filePath = path.join(localesDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = getFlattenedKeys(content);
        const keysCount = Object.keys(keys).length;
        
        console.log(`Checking ${file}...`);
        
        if (keysCount !== referenceKeysCount) {
            console.error(`❌ ${file} has ${keysCount} keys, but ${referenceFile} has ${referenceKeysCount} keys.`);
            exitCode = 1;
        } else {
            console.log(`  ${file} matches reference key count (${keysCount}).`);
        }
        
        // Detailed check for matching keys
        const missingKeys = Object.keys(referenceKeys).filter(k => !keys[k]);
        const extraKeys = Object.keys(keys).filter(k => !referenceKeys[k]);
        
        if (missingKeys.length > 0) {
            console.error(`  ❌ Missing keys in ${file}:`, missingKeys);
            exitCode = 1;
        }
        
        if (extraKeys.length > 0) {
            console.error(`  ❌ Extra keys in ${file} (not in reference):`, extraKeys);
            exitCode = 1;
        }
        
        if (missingKeys.length === 0 && extraKeys.length === 0 && keysCount === referenceKeysCount) {
            console.log(`  ✅ ${file} passed all validation checks!`);
        }
        
    } catch (e) {
        console.error(`❌ Failed to parse/check ${file}:`, e.message);
        exitCode = 1;
    }
}

if (exitCode === 0) {
    console.log('\n🎉 SUCCESS: All translation files are valid and keys match exactly by count and names!');
} else {
    console.error('\n❌ FAILURE: Key discrepancies found between translation files.');
}

process.exit(exitCode);
