const fs = require('fs').promises;
const path = require('path');

const svgDir = path.join('node_modules', 'twemoji-emojis', 'vendor', 'svg');

async function readJsonFile(filename) {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
}

async function findClosestSvg(shortName, emojiData) {
    const files = await fs.readdir(svgDir);
    const unified = emojiData.find(e => e.short_name === shortName)?.unified.toLowerCase();
    
    if (!unified) return null;

    const closestMatch = files.find(file => file.startsWith(unified.split('-')[0]));
    return closestMatch || null;
}

async function processEmojis() {

    // Get the emoji.json from https://github.com/iamcal/emoji-data/blob/master/emoji.json

    const emojiData = await readJsonFile('emoji.json');
    const selectedEmojisMap = await readJsonFile('selected-emojis-map.json');
    const output = [];
    const missing = [];

    for (const [shortName, name] of Object.entries(selectedEmojisMap)) {
        const emoji = emojiData.find(e => e.short_name === shortName);
        const svgFilename = await findClosestSvg(shortName, emojiData);

        if (emoji && svgFilename) {
            output.push({
                short_name: shortName,
                name: name,
                filename: svgFilename,
                unified: emoji.unified,
                category: emoji.category,
                subcategory: emoji.subcategory
            });
        } else {
            missing.push(shortName);
        }
    }

    await fs.writeFile('output.json', JSON.stringify(output, null, 2));
    await fs.writeFile('missing.json', JSON.stringify(missing, null, 2));

    console.log(`Processed ${output.length} emojis. ${missing.length} emojis are missing.`);
}

processEmojis().catch(console.error);
