const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: async (base64, filename) => {
    return await ipcRenderer.invoke('save-file', { base64, filename });
  },
  openFile: async (filePath) => {
    return await ipcRenderer.invoke('open-file', { filePath });
  }
});
