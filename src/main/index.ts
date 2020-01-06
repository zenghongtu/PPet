import { app, BrowserWindow, screen, crashReporter } from 'electron';
import path from 'path';
import { format as formatUrl } from 'url';
import { autoUpdater } from 'electron-updater';
import Positioner from 'electron-positioner';
import * as Sentry from '@sentry/electron';
import initTray from './ppetTray';

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
const isLinux = process.platform === 'linux';

app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

// TODO: https://stackoverflow.com/questions/53538215/cant-succeed-in-making-transparent-window-in-electron-javascript
if (isLinux) {
  app.commandLine.appendSwitch('enable-transparent-visuals');
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;
let mainWindowPositioner;

if (process.platform === 'darwin' && !isDevelopment) {
  app.dock.hide();
}

function createMainWindow() {
  const window = new BrowserWindow({
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

const onAppReady = () => {
  mainWindow = createMainWindow();
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.webContents.setIgnoreMenuShortcuts(true);
  // mainWindow.setIgnoreMouseEvents(true);

  mainWindowPositioner = new Positioner(mainWindow);
  mainWindowPositioner.move('bottomRight');

  initTray(mainWindow);
};

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  if (isLinux) {
    setTimeout(() => {
      onAppReady();
    }, 500);
  } else {
    onAppReady();
  }

  autoUpdater.checkForUpdatesAndNotify();
});
