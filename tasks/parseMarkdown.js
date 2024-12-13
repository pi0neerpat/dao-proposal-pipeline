const fs = require("fs");
const path = require("path");

// Example usage: node tasks/parseMarkdown.js newcollateral.notes.md

const args = process.argv.slice(2);
const basePath = args[0]
const contents = fs.readFileSync(basePath, 'utf8')
const obj = { description: contents.replace(/["`]/g, "\\$&") };

console.log(JSON.stringify(obj))