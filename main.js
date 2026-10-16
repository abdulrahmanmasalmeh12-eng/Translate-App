const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL('http://localhost:3000'); // or loadFile('index.html')
}

app.whenReady().then(createWindow);