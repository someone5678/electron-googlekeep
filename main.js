const { app, BrowserWindow } = require('electron');
const path = require('path');
const { shell } = require('electron')
const windowStateKeeper = require('electron-window-state');

async function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1280,
    defaultHeight: 800
  });

  const mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
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
  mainWindowState.manage(mainWindow);
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
