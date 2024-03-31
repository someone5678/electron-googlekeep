const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ElectronBlocker, fullLists, Request } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');
const { readFileSync, writeFileSync } = require('fs');
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
    title: "Twitter",
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    icon: path.join(global.__static, 'icons/icon-48x48.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });

  const blocker = await ElectronBlocker.fromPrebuiltAdsOnly(
    fetch
  );
  blocker.enableBlockingInSession(mainWindow.webContents.session);
  mainWindow.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36";
  mainWindow.loadURL('https://twitter.com/');
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
