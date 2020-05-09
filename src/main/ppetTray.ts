import {
  BrowserWindow,
  Menu,
  app,
  Tray,
  nativeImage,
  shell,
  dialog,
  MenuItemConstructorOptions,
  MenuItem
} from 'electron';
import path from 'path';
import fs from 'fs-extra';
import electronLocalshortcut from 'electron-localshortcut';
import config from '../common/config';
import { createPluginsWindow } from './';

let ppetTray: Tray | null = null;

const trayImgPath = path.join(
  __static,
  'icons',
  process.platform === 'darwin' ? 'strip-tray.png' : 'tray.png'
);

const userDataPath = app.getPath('userData');
const modelCachePath = path.join(userDataPath, 'model');
const defaultModelConfigPath = (global.defaultModelConfigPath = path.join(
  modelCachePath,
  'model.json'
));

const langs = {
  zh: {
    alwaysOnTop: '@置顶',
    ignoreMouseEvents: '忽略点击',
    openAtLogin: '开机启动',
    plugins: '插件中心',
    tools: '小工具',
    language: '语言',
    zoomIn: '放大',
    zoomOut: '缩小',
    zoomReset: '原始大小',
    canvasSettings: '画布设置',
    clearSettings: '清除设置',
    importModel: '导入模型',
    importOnlineModel: '导入在线模型',
    removeModel: '移除模型',
    reRender: '重新渲染',
    debug: '调试',
    feedback: '反馈建议',
    about: '关于 PPet',
    quit: '退出 PPet',
    model: {
      title: '请选择模型配置文件',
      buttonLabel: '导入模型',
      filtersName: '模型配置文件'
    },
    errorBox: {
      title: '导入模型失败',
      title1: '移除模型失败',
      getContent: (text: string) =>
        `无效的model配置文件，该文件为'.json'结尾，会包含${text}等字段`
    }
  },
  en: {
    alwaysOnTop: 'Always On Top',
    ignoreMouseEvents: 'Ignore Mouse Events',
    openAtLogin: 'Open At Login',
    plugins: 'Plugins',
    tools: 'Tools',
    language: 'Language',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Zoom Reset',
    canvasSettings: 'Canvas Settings',
    clearSettings: 'Clear Canvas Settings',
    importModel: 'Import Model',
    importOnlineModel: 'Import Online Model',
    removeModel: 'Remove Model',
    reRender: 'ReRender',
    debug: 'Debug',
    feedback: 'Feedback',
    about: 'About PPet',
    quit: 'Quit PPet',
    model: {
      title: 'Please select model configuration file',
      buttonLabel: 'Import model',
      filtersName: 'model configuration file'
    },
    errorBox: {
      title: 'Import model failed',
      title1: 'Remove model failed',
      getContent: (text: string) =>
        `Invalid model configuration file. The file ends with '.json' and should contain fields such as ${text}`
    }
  }
};

type langType = keyof typeof langs;

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

  const alwaysOnTop = config.get('alwaysOnTop', true);
  const ignoreMouseEvents = config.get('ignoreMouseEvents', false);
  const showTool = config.get('showTool', true);
  const language = config.get(
    'language',
    app.getLocale().includes('zh') ? 'zh' : 'en'
  );

  mainWindow.setAlwaysOnTop(alwaysOnTop);
  mainWindow.setIgnoreMouseEvents(ignoreMouseEvents, { forward: true });

  mainWindow.once('show', () => {
    mainWindow.webContents.send('switch-tool-message', showTool);
    mainWindow.webContents.send('lang-change-message', language);
  });

  const handleClickLangRadio = (lang: langType) => {
    config.set('language', lang);
    mainWindow.webContents.send('lang-change-message', lang);
    setTrayMenu(lang);
  };

  const setTrayMenu = (lang: langType) => {
    const cl = langs[lang];

    const template: Array<MenuItemConstructorOptions | MenuItem> = [
      {
        label: cl.alwaysOnTop,
        type: 'checkbox',
        checked: alwaysOnTop,
        click: item => {
          const { checked } = item;
          mainWindow.setAlwaysOnTop(checked);
          config.set('alwaysOnTop', checked);
        }
      },
      {
        label: cl.ignoreMouseEvents,
        type: 'checkbox',
        checked: ignoreMouseEvents,
        click: item => {
          const { checked } = item;
          mainWindow.setIgnoreMouseEvents(checked, { forward: true });
          config.set('ignoreMouseEvents', checked);
        }
      },
      {
        label: cl.openAtLogin,
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: item => {
          const { checked } = item;
          app.setLoginItemSettings({ openAtLogin: checked });
        }
      },
      {
        label: cl.tools,
        type: 'checkbox',
        checked: showTool,
        click: item => {
          const { checked } = item;
          mainWindow.webContents.send('switch-tool-message', checked);
          config.set('showTool', checked);
        }
      },
      {
        label: cl.language,
        type: 'submenu',
        submenu: [
          {
            label: '简体中文',
            type: 'radio',
            checked: lang === 'zh',
            click: handleClickLangRadio.bind(null, 'zh')
          },
          {
            label: 'English',
            type: 'radio',
            checked: lang === 'en',
            click: handleClickLangRadio.bind(null, 'en')
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: cl.plugins,
        click: item => {
          createPluginsWindow();
        }
      },
      {
        type: 'separator'
      },
      {
        label: cl.zoomIn,
        accelerator: 'CmdOrCtrl+=',
        click: async () => {
          sendMessage('zoomIn');
        }
      },
      {
        label: cl.zoomOut,
        accelerator: 'CmdOrCtrl+-',
        click: async () => {
          sendMessage('zoomOut');
        }
      },
      {
        label: cl.zoomReset,
        accelerator: 'CmdOrCtrl+0',
        click: async () => {
          sendMessage('reset');
        }
      },
      {
        label: cl.canvasSettings,
        accelerator: 'CmdOrCtrl+,',
        click: async () => {
          mainWindow.webContents.send('model-change-message', {
            type: 'setting'
          });
        }
      },
      {
        label: cl.clearSettings,
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
        label: cl.importModel,
        click: async () => {
          try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              title: cl.model.title,
              buttonLabel: cl.model.buttonLabel,
              filters: [{ name: cl.model.filtersName, extensions: ['json'] }],
              properties: ['openFile']
            });

            if (canceled) {
              return;
            }

            const filePath = filePaths[0];
            const fileName = path.basename(filePath);

            const requiredFieldList = ['model', 'textures'];

            const contentStr = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const config = JSON.parse(contentStr);
            const keys = Object.keys(config);

            if (requiredFieldList.every(key => keys.includes(key))) {
              const modelFolder = path.dirname(filePath);
              fs.copySync(modelFolder, modelCachePath);
              const _filePath = path.join(modelCachePath, fileName);
              fs.renameSync(_filePath, defaultModelConfigPath);

              mainWindow.webContents.send('model-change-message', {
                type: 'loaded'
              });
            } else {
              dialog.showErrorBox(
                cl.errorBox.title,
                cl.errorBox.getContent(requiredFieldList.toString())
              );
              console.error('invalid model config');
            }
          } catch (err) {
            dialog.showErrorBox(cl.errorBox.title, err.message || '...');
            console.error('load model error: ', err);
          }
        }
      },
      {
        label: cl.importOnlineModel,
        click: async () => {
          mainWindow.webContents.send('model-change-message', {
            type: 'load-online'
          });
        }
      },
      {
        label: cl.removeModel,
        click: async () => {
          try {
            fs.removeSync(modelCachePath);
            mainWindow.webContents.send('model-change-message', {
              type: 'remove'
            });
          } catch (err) {
            dialog.showErrorBox(cl.errorBox.title1, err.message || '...');
            console.error('remove model error: ', err);
          }
        }
      },
      {
        label: cl.reRender,
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
        label: cl.debug,
        click: () => {
          mainWindow.webContents.openDevTools({ mode: 'undocked' });
        }
      },
      {
        type: 'separator'
      },
      {
        label: cl.feedback,
        click: () => {
          shell.openExternal('https://github.com/zenghongtu/PPet/issues');
        }
      },
      {
        label: cl.about,
        role: 'about'
      },
      {
        label: cl.quit,
        click: item => {
          app.quit();
        }
      }
    ];

    const menu = Menu.buildFromTemplate(template);

    if (!ppetTray) {
      ppetTray = new Tray(trayImg);
    }

    ppetTray.setContextMenu(menu);
  };

  const trayImg = nativeImage.createFromPath(trayImgPath);
  ppetTray = new Tray(trayImg);

  // TODO: more language?
  const currLang = language;

  setTrayMenu(currLang);
};

export default initTray;
