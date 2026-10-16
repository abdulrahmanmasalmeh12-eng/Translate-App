const fs = require("fs");
const path = require("path");

const outputDirectory = path.join(__dirname, "render-site");
const webFiles = ["index.html", "app.js", "style.css", "manifest.json", "sw.js"];

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of webFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}

fs.mkdirSync(path.join(outputDirectory, "icons"), { recursive: true });
fs.copyFileSync(
  path.join(__dirname, "icons", "app-icon.svg"),
  path.join(outputDirectory, "icons", "app-icon.svg")
);

console.log(`Prepared web assets and PWA icon in render-site/`);