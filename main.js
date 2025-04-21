const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Allow IPC communication
        },
    });

    mainWindow.loadFile("src/index.html");

    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('updateReady');
});

// Handle file picker request from `renderer.js`
ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Audio Files", extensions: ["mp3", "wav"] }],
    });

    return result.filePaths.length > 0 ? result.filePaths[0] : null;
});
