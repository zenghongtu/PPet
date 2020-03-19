import {
  app,
  BrowserWindow,
  screen,
  crashReporter,
  ipcMain,
  BrowserWindowConstructorOptions
} from 'electron';
import path from 'path';
import { format as formatUrl } from 'url';
import { autoUpdater } from 'electron-updater';
import Positioner from 'electron-positioner';
import * as Sentry from '@sentry/electron';
import initTray from './ppetTray';
import config from 'common/config';
import initPPetPlugins from './ppetPlugins';
import initStaticServe from './staticServe';

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
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// TODO: https://stackoverflow.com/questions/53538215/cant-succeed-in-making-transparent-window-in-electron-javascript
if (isLinux) {
  app.commandLine.appendSwitch('enable-transparent-visuals');
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;
let pluginsWindow: BrowserWindow | null;
let mainWindowPositioner;

if (process.platform === 'darwin' && !isDevelopment) {
  app.dock.hide();
}

function createMainWindow() {
  const winBounds = config.get('winBounds.mainWindow', null);
  console.log('winBounds: ', winBounds);

  const opts: BrowserWindowConstructorOptions = {
    show: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    hasShadow: false,
    transparent: true,
    frame: false,
    width: 350,
    height: 350,
    skipTaskbar: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      backgroundThrottling: false
    }
  };
  Object.assign(opts, winBounds);
  const window = new BrowserWindow(opts);

  global.mainWindow = window;
  // global.mainWebContentsId = window.webContents.id;

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

  initPPetPlugins(window);

  window.on('moved', () => {
    config.set('winBounds.mainWindow', window.getBounds());
  });

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
    if (!winBounds) {
      mainWindowPositioner = new Positioner(window);
      mainWindowPositioner.move('bottomRight');
    }

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

export function createPluginsWindow() {
  if (pluginsWindow && !pluginsWindow.isDestroyed()) {
    pluginsWindow.show();
    return;
  }
  const window = new BrowserWindow({
    // show: false,
    alwaysOnTop: false,
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  pluginsWindow = window;
  global.pluginWebContents = window.webContents;

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/plugins.html`
    );
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'plugins.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.on('closed', () => {
    pluginsWindow = null;
    global.pluginWebContents = undefined;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  // window.on('ready-to-show', () => {
  //   window.show();
  // });

  return window;
}

const onAppReady = () => {
  mainWindow = createMainWindow();
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setVisibleOnAllWorkspaces(true);
  // mainWindow.webContents.setIgnoreMenuShortcuts(true);
  // mainWindow.setIgnoreMouseEvents(true);

  initStaticServe();
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
