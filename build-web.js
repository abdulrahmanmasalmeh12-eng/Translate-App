const fs = require("fs");
const path = require("path");

const outputDirectory = path.join(__dirname, "render-site");
const webFiles = ["index.html", "app.js", "style.css", "manifest.json", "sw.js"];

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of webFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}

console.log(`Prepared ${webFiles.length} web assets in render-site/`);