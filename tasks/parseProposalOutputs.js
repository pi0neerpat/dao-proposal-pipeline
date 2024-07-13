const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const targetEnv = args[0].toLowerCase();

const inputPath = path.join(__dirname, `../gov-output/${targetEnv}/`);

const outputPath = getMostRecentWrittenFile(inputPath);

const outputJson = require(outputPath);

outputJson.proposalId = BigInt(outputJson.proposalId).toString();

// find most recently written json file in target env output folder

function getMostRecentWrittenFile(targetPath) {
  // Read the directory contents
  const files = fs.readdirSync(targetPath);

  // Filter for JSON files
  const jsonFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".json"
  );

  if (jsonFiles.length === 0) {
    throw new Error("No JSON files found in the specified folder.");
  }

  let mostRecentFile = null;
  let mostRecentTime = 0;

  // Iterate through JSON files
  for (const file of jsonFiles) {
    const filePath = path.join(targetPath, file);
    const stats = fs.statSync(filePath);

    if (stats.mtimeMs > mostRecentTime) {
      mostRecentFile = filePath;
      mostRecentTime = stats.mtimeMs;
    }
  }

  if (mostRecentFile) {
    return mostRecentFile;
  } else {
    throw new Error("Unable to determine the most recent JSON file.");
  }
}

fs.writeFile(outputPath, JSON.stringify(outputJson, null, 2), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});

return;
