// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    processPrompt: (prompt, history, config) =>
        ipcRenderer.invoke("processPrompt", prompt, history, config),
    getDefaultConfig: () => ipcRenderer.invoke("getDefaultConfig"),
    onStatusUpdate: (callback) =>
        ipcRenderer.on("status-update", (_event, message) => callback(message)),
    offStatusUpdate: (callback) => ipcRenderer.off("status-update", callback),
});
