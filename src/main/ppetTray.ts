import { BrowserWindow, Menu, app, Tray, nativeImage, shell } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';

let ppetTray;

const trayImgPath = path.join(__static, 'icons', 'tray.png');

const initTray = (mainWindow: BrowserWindow) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '@置顶',
      type: 'checkbox',
      checked: true,
      click: item => {
        const { checked } = item;
        mainWindow.setAlwaysOnTop(checked);
      }
    },
    {
      label: '忽略点击',
      type: 'checkbox',
      checked: false,
      click: item => {
        const { checked } = item;
        mainWindow.setIgnoreMouseEvents(checked);
      }
    },
    {
      label: '开机启动',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: item => {
        const { checked } = item;
        app.setLoginItemSettings({ openAtLogin: checked });
      }
    },
    {
      label: '小工具',
      type: 'checkbox',
      checked: true,
      click: item => {
        const { checked } = item;
        mainWindow.webContents.send('switch-tool-message', checked);
      }
    },
    {
      type: 'separator'
    },
    {
      label: '检查更新',
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      }
    },
    {
      label: '反馈建议',
      click: () => {
        shell.openExternal('https://github.com/zenghongtu/PPet/issues');
      }
    },
    {
      label: '关于PPet',
      role: 'about'
    },
    {
      label: '退出',
      click: item => {
        app.quit();
      }
    }
  ]);

  const trayImg = nativeImage.createFromPath(trayImgPath);
  ppetTray = new Tray(trayImg);
  ppetTray.setContextMenu(menu);
};

export default initTray;
