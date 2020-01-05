import { app, BrowserWindow, screen, crashReporter } from 'electron';
import path from 'path';
import { format as formatUrl } from 'url';
import { autoUpdater } from 'electron-updater';
import * as Sentry from '@sentry/electron';

Sentry.init({
  dsn: 'https://57b49a715b324bbf928b32f92054c8d6@sentry.io/1872002'
});

crashReporter.start({
  companyName: 'None',
  productName: 'PPet',
  ignoreSystemCrashHandler: true,
  submitURL:
    'https://sentry.io/api/1872002/minidump/?sentry_key=57b49a715b324bbf928b32f92054c8d6'
});

const isDevelopment = process.env.NODE_ENV !== 'production';

app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

app.dock.hide();

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;

  const window = new BrowserWindow({
    x: Math.floor(0.9 * width),
    y: Math.floor(0.9 * height),
    show: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    hasShadow: false,
    transparent: true,
    frame: false,
    width: 350,
    height: 350,
    minimizable: false,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      backgroundThrottling: false
    }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  window.on('ready-to-show', () => {
    window.show();
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setVisibleOnAllWorkspaces(true);
  // mainWindow.setIgnoreMouseEvents(true);

  autoUpdater.checkForUpdatesAndNotify();
});
