const fs = require('fs').promises;
const path = require('path');

const sourceDir = 'node_modules/twemoji-emojis/vendor/svg';
const destDir = 'dist/svg';
const jsonFile = 'output.json';

async function copyEmojiSVGs() {
  try {
    // Read and parse the JSON file
    const jsonData = await fs.readFile(jsonFile, 'utf8');
    const emojis = JSON.parse(jsonData);

    // Create the destination directory if it doesn't exist
    await fs.mkdir(destDir, { recursive: true });

    // Copy each SVG file
    for (const emoji of emojis) {
      const sourceFile = path.join(sourceDir, emoji.filename);
      const destFile = path.join(destDir, emoji.filename);

      try {
        await fs.copyFile(sourceFile, destFile);
        console.log(`Copied: ${emoji.filename}`);
      } catch (err) {
        console.error(`Error copying ${emoji.filename}: ${err.message}`);
      }
    }

    console.log('All SVG files have been copied successfully.');
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

copyEmojiSVGs();
