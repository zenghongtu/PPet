import * as Sentry from '@sentry/electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicLayout from './layouts/BasicLayout';
import './index.scss';
import { initGA, sendEvent } from './utils/ga';
import { remote } from 'electron';

Sentry.init({
  dsn: 'https://57b49a715b324bbf928b32f92054c8d6@sentry.io/1872002'
});

initGA();

remote.getCurrentWindow().on('focus', () => {
  sendEvent('window', 'focus');
});

remote.getCurrentWindow().on('blur', () => {
  sendEvent('window', 'blur');
});

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
  },
  false
);

// https://github.com/electron/electron/issues/22545

// interface IPPet extends Electron.BrowserWindow {
//   showMessage: IShowMessageFunc;
// }

// window.__plugins = {};

// const showMessage: IShowMessageFunc = (text, timeout = 4000, priority = 0) => {
//   emitter.emit('waifu-show-message', { text, timeout, priority });
// };

// // TODO 渲染完成后，加载插件
// const installPlugin = (name: string, code: string) => {
//   console.log('install plugin: ', name);
//   if (window.__plugins[name]) {
//     showMessage(
//       `Installed plugin failed: ${name}. Error message: repeat install plugin`
//     );
//     return;
//   }
// const func = new Function('ppet', 'app', 'module', code);

// const ppet: IPPet = remote.getGlobal('mainWindow');

// ppet.showMessage = showMessage;

// const module = {
//   exports: () => {
//     // TODO
//     return '';
//   }
// };

// func(ppet, remote.app, module);

//   if (typeof module !== 'object' || typeof module.exports !== 'function') {
//     showMessage(
//       `Installed plugin failed: ${name}. Error message: invalid plugin`
//     );
//     return;
//   }

//   try {
//     window.__plugins[name] = module.exports.call(null) || +new Date();
//     showMessage(`Installed plugin: ${name}`);
//     ipcRenderer.sendTo(
//       remote.getGlobal('pluginWebContentsId'),
//       'update-plugin-status-message',
//       { name, status: 'active' }
//     );
//   } catch (err) {
//     showMessage(
//       `Install plugin failed: ${name}. Error message: ${err.message}`
//     );
//     console.log(err);
//   } finally {
//     // TODO
//   }
// };

// const uninstallPlugin = (name: string) => {
//   console.log('remove plugin: ', name);

//   if (!window.__plugins[name]) {
//     showMessage(
//       `Uninstall plugin failed: ${name}. Error message: not found the plugin`
//     );
//   } else {
//     if (typeof window.__plugins[name] === 'function') {
//       window.__plugins[name].call(null);
//     }
//     delete window.__plugins[name];
//     showMessage(`Uninstalled Plugin: ${name}`);
//   }

//   ipcRenderer.sendTo(
//     remote.getGlobal('pluginWebContentsId'),
//     'update-plugin-status-message',
//     { name, status: 'inactive' }
//   );
// };

// ipcRenderer.on('add-plugin-message', (event, plugin) => {
//   showMessage(`Installing Plugin: ${plugin.name}`);

//   const { createdAt, updatedAt, name, code } = plugin;
//   installPlugin(name, code);
// });

// ipcRenderer.on('remove-plugin-message', (event, { name }) => {
//   showMessage(`Uninstalling Plugin: ${name}`);

//   uninstallPlugin(name);
// });

// ipcRenderer.on('get-active-plugins-message', event => {
//   ipcRenderer.sendTo(
//     remote.getGlobal('pluginWebContentsId'),
//     'active-plugins-message',
//     Object.keys(window.__plugins)
//   );
// });

// setTimeout(() => {
//   const plugins = config.get('plugins', {});
//   Object.values(plugins).forEach(plugin => {
//     const { code, name, status } = plugin;
//     if (status === 'active') {
//       installPlugin(name, code);
//     }
//   });
// });

ReactDOM.render(<BasicLayout />, document.getElementById('app'));
