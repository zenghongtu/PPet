import { IShowMessageFunc } from '@/modules/Pet';
import { BrowserWindow, app, ipcMain } from 'electron';
import fetch from 'node-fetch';
import config from 'common/config';

interface IPPet extends Electron.BrowserWindow {
  showMessage?: IShowMessageFunc;
}

const initPPetPlugins = (mainWindow: BrowserWindow) => {
  global.__plugins = {};

  const showMessage: IShowMessageFunc = (
    text,
    timeout = 4000,
    priority = 15
  ) => {
    console.log('text: ', text);
    mainWindow.webContents.send('waifu-show-message', {
      text,
      timeout,
      priority
    });
  };

  const installPlugin = async (name: string, code: string) => {
    console.log('install plugin: ', name);
    if (global.__plugins[name]) {
      showMessage(
        `Installed plugin failed: ${name}. Error message: repeat install plugin`
      );
      return;
    }

    const func = new Function('ppet', 'app', 'fetch', 'module', code);

    const ppet: IPPet = mainWindow;

    ppet.showMessage = showMessage;

    const module = {
      exports: () => {
        // TODO
        return '';
      }
    };

    // TODO
    func(ppet, app, fetch, module);

    if (typeof module !== 'object' || typeof module.exports !== 'function') {
      showMessage(
        `Installed plugin failed: ${name}. Error message: invalid plugin`
      );
      return;
    }

    try {
      global.__plugins[name] = module.exports.call(null) || +new Date();
      showMessage(`Installed plugin: ${name}`);

      global.pluginWebContents?.send('update-plugin-status-message', {
        name,
        status: 'active'
      });
    } catch (err) {
      showMessage(
        `Install plugin failed: ${name}. Error message: ${err.message}`
      );
      console.log(err);
    } finally {
      // TODO
    }
  };

  const uninstallPlugin = (name: string) => {
    console.log('remove plugin: ', name);

    if (!global.__plugins[name]) {
      showMessage(
        `Uninstall plugin failed: ${name}. Error message: not found the plugin`
      );
    } else {
      if (typeof global.__plugins[name] === 'function') {
        global.__plugins[name].call(null);
      }
      delete global.__plugins[name];
      showMessage(`Uninstalled Plugin: ${name}`);
    }

    global.pluginWebContents?.send('update-plugin-status-message', {
      name,
      status: 'inactive'
    });
  };

  ipcMain.on('add-plugin-message', (event, plugin) => {
    showMessage(`Installing Plugin: ${plugin.name}`);

    const { createdAt, updatedAt, name, code } = plugin;
    installPlugin(name, code);
  });

  ipcMain.on('remove-plugin-message', (event, { name }) => {
    showMessage(`Uninstalling Plugin: ${name}`);

    uninstallPlugin(name);
  });

  ipcMain.on('get-active-plugins-message', event => {
    global.pluginWebContents?.send(
      'active-plugins-message',
      Object.keys(global.__plugins)
    );
  });

  mainWindow.once('show', () => {
    const plugins: {
      [key: string]: { code: string; name: string; status: string };
    } = config.get('plugins', {});
    Object.values(plugins).forEach(plugin => {
      const { code, name, status } = plugin;
      if (status === 'active') {
        installPlugin(name, code);
      }
    });
  });
};

export default initPPetPlugins;
