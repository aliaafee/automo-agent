const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const DEV_URL = "http://localhost:5173";
const isDev = !app.isPackaged;

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isDev) {
        win.loadURL(DEV_URL);
    } else {
        win.loadFile(path.join(__dirname, "dist/renderer/index.html"));
    }
};

app.whenReady().then(() => {
    ipcMain.handle("ping", () => "pong");

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
