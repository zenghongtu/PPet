import * as Sentry from '@sentry/electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicLayout from './layouts/BasicLayout';
import './index.scss';
import emitter from '@/utils/emitter';
import { ipcRenderer, remote } from 'electron';
import { IShowMessageFunc } from './modules/Pet';

Sentry.init({
  dsn: 'https://57b49a715b324bbf928b32f92054c8d6@sentry.io/1872002'
});

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
  },
  false
);

interface IPPet extends Electron.BrowserWindow {
  showMessage: IShowMessageFunc;
}

window.__plugins = {};

const showMessage: IShowMessageFunc = (...args) => {
  emitter.emit('waifu-show-message', args);
};

// TODO 渲染完成后，加载插件
const installPlugin = (name: string, code: string) => {
  const func = new Function('ppet', 'app', 'module', code);

  const ppet: IPPet = remote.getGlobal('mainWindow');

  ppet.showMessage = showMessage;

  const module = {
    exports: () => {
      // TODO
      return '';
    }
  };

  func(ppet, remote.app, module);

  if (typeof module !== 'object' || typeof module.exports !== 'function') {
    // TODO
    return;
  }
  try {
    // TODO 处理回调
    window.__plugins[name] = module.exports.call(null) || +new Date();
  } catch (e) {
    // TODO 提醒错误
    console.log('error');
  }
};

const uninstallPlugin = (name: string) => {
  if (!window.__plugins[name]) {
    // TODO
    return;
  }

  if (typeof window.__plugins[name] === 'function') {
    window.__plugins[name].call(null);
  }
  delete window.__plugins[name];
};

ipcRenderer.on('add-plugin-message', (event, plugin) => {
  // TODO
  const { createdAt, updatedAt, label, name, code } = plugin;
  installPlugin(name, code);
});

ipcRenderer.on('remove-plugin-message', (event, { name }) => {
  console.log('name: ', name);
  uninstallPlugin(name);
});

ReactDOM.render(<BasicLayout />, document.getElementById('app'));
