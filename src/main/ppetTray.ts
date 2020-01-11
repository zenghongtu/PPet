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
import electronLocalshortcut from 'electron-localshortcut';

let ppetTray;

const trayImgPath = path.join(__static, 'icons', 'tray.png');

const userDataPath = app.getPath('userData');
const modelCachePath = path.join(userDataPath, 'model');
const defaultModelConfigPath = (global.defaultModelConfigPath = path.join(
  modelCachePath,
  'model.json'
));

// TODO refactor
const initTray = (mainWindow: BrowserWindow) => {
  const sendMessage = (type: 'zoomIn' | 'zoomOut' | 'reset') => {
    mainWindow?.webContents.send('zoom-change-message', type);
  };

  electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+=', () => {
    sendMessage('zoomIn');
  });

  electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+-', () => {
    sendMessage('zoomOut');
  });
  electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+0', () => {
    sendMessage('reset');
  });
  electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+,', () => {
    mainWindow.webContents.send('model-change-message', {
      type: 'setting'
    });
  });
  electronLocalshortcut.register(mainWindow, 'CmdOrCtrl+r', () => {
    app.relaunch();
    app.exit(0);
  });

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
      label: '放大',
      accelerator: 'CmdOrCtrl+=',
      click: async () => {
        sendMessage('zoomIn');
      }
    },
    {
      label: '缩小',
      accelerator: 'CmdOrCtrl+-',
      click: async () => {
        sendMessage('zoomOut');
      }
    },
    {
      label: '原始大小',
      accelerator: 'CmdOrCtrl+0',
      click: async () => {
        sendMessage('reset');
      }
    },
    {
      label: '画布设置',
      accelerator: 'CmdOrCtrl+,',
      click: async () => {
        mainWindow.webContents.send('model-change-message', {
          type: 'setting'
        });
      }
    },
    {
      label: '清除设置',
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

          const requiredKeyList = ['layout', 'model', 'textures', 'motions'];

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
      label: '重新渲染',
      accelerator: 'CmdOrCtrl+r',
      click: () => {
        app.relaunch();
        app.exit(0);
      }
    },
    {
      type: 'separator'
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
