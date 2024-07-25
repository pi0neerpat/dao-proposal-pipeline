const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "../notes.md");
const contents = fs.readFileSync(basePath, 'utf8')
const obj = { details: contents };

console.log(JSON.stringify(obj))