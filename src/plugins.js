const fs = require('fs');
const path = require('path');

const PLUGINS_FOLDER_PATH = path.join(__dirname, '../plugins');

const plugins = {};

const folder = fs.readdirSync(PLUGINS_FOLDER_PATH);
for (const entry of folder) {
    if (entry.endsWith('.plugin.js')) {
        const key = entry.replace('.plugin.js', '');
        plugins[key] = require(path.join(PLUGINS_FOLDER_PATH, entry));
    }
}
module.exports = plugins;