const { app, BrowserWindow } = require('electron');
const path = require('path');
const { shell } = require('electron')
const windowStateKeeper = require('electron-window-state');

// Static folder is not detected correctly in production
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

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
    title: "Google Tasks",
    autoHideMenuBar: true,
    backgroundColor: "#282828",
    icon: path.join(global.__static, 'icons/icon-48x48.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  mainWindow.webContents.userAgent = 'Chrome';
  mainWindow.loadURL('https://calendar.google.com/u/0/r/tasks/');
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
