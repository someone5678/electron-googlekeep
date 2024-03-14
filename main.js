const { app, BrowserWindow } = require('electron');
const path = require('path');
const { shell } = require('electron')

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 500,
    minHeight: 550,
    fullscreen: false,
    resizable: true,
    frame: true,
    kiosk: false,
    title: "Google Keep",
    autoHideMenuBar: true,
    backgroundColor: "#282828",
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  mainWindow.webContents.userAgent = 'Chrome';
  mainWindow.loadURL('https://keep.google.com/');
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
