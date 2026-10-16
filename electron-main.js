const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("save-file", async (_event, { base64, filename }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({ defaultPath: filename });
    if (canceled || !filePath) return { ok: false };
    await fs.promises.writeFile(filePath, Buffer.from(base64, "base64"));
    return { ok: true, path: filePath };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle("open-file", async (_event, { filePath }) => {
  try {
    const error = await shell.openPath(filePath);
    return error ? { ok: false, error } : { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
