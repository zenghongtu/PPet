import {
  BrowserWindow,
  Menu,
  app,
  Tray,
  nativeImage,
  shell,
  dialog
} from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { autoUpdater } from 'electron-updater';

let ppetTray;

const trayImgPath = path.join(__static, 'icons', 'tray.png');

const userDataPath = app.getPath('userData');
const modelCachePath = path.join(userDataPath, 'model');
const defaultModelConfigPath = (global.defaultModelConfigPath = path.join(
  modelCachePath,
  'model.json'
));

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
      label: '导入Model',
      click: async () => {
        try {
          const { canceled, filePaths } = await dialog.showOpenDialog({
            title: '请选择model配置文件',
            buttonLabel: '导入Model',
            filters: [{ name: 'model配置文件', extensions: ['json'] }],
            properties: ['openFile']
          });

          if (canceled) {
            return;
          }

          const filePath = filePaths[0];
          const fileName = path.basename(filePath);

          const requiredKeyList = ['version', 'model', 'textures', 'motions'];

          const contentStr = fs.readFileSync(filePath, { encoding: 'utf-8' });
          const config = JSON.parse(contentStr);
          const keys = Object.keys(config);

          if (requiredKeyList.every(key => keys.includes(key))) {
            const modelFolder = path.dirname(filePath);
            fs.copySync(modelFolder, modelCachePath);
            const _filePath = path.join(modelCachePath, fileName);
            fs.renameSync(_filePath, defaultModelConfigPath);

            mainWindow.webContents.send('model-change-message', {
              type: 'loaded'
            });
          } else {
            dialog.showErrorBox(
              '导入 model 失败',
              `无效的model配置文件，该文件为'.json'结尾，会包含${requiredKeyList.toString()}等字段`
            );
            console.error('invalid model config');
          }
        } catch (err) {
          dialog.showErrorBox('导入 model 失败', err.message || '...');
          console.error('load model error: ', err);
        }
      }
    },
    {
      label: '设置Model',
      click: async () => {
        mainWindow.webContents.send('model-change-message', {
          type: 'setting'
        });
      }
    },
    {
      label: '移除Model',
      click: async () => {
        try {
          fs.removeSync(modelCachePath);
          mainWindow.webContents.send('model-change-message', {
            type: 'remove'
          });
        } catch (err) {
          dialog.showErrorBox('移除 model 失败', err.message || '...');
          console.error('remove model error: ', err);
        }
      }
    },
    {
      label: '清除配置',
      click: async () => {
        mainWindow.webContents.send('model-change-message', {
          type: 'setting-reset'
        });
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
