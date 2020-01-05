import { remote } from 'electron';
import * as Sentry from '@sentry/electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicLayout from './layouts/BasicLayout';
import './index.scss';
import emitter from './utils/emitter';

Sentry.init({
  dsn: 'https://57b49a715b324bbf928b32f92054c8d6@sentry.io/1872002'
});

const { Menu, MenuItem, app, getCurrentWindow } = remote;

const menu = Menu.buildFromTemplate([
  {
    label: '@置顶',
    type: 'checkbox',
    checked: true,
    click: item => {
      const { checked } = item;
      getCurrentWindow().setAlwaysOnTop(checked);
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
      emitter.emit('show-tool', checked);
    }
  },
  {
    label: '退出',
    click: item => {
      app.quit();
    }
  }
]);

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
    menu.popup({ window: remote.getCurrentWindow() });
  },
  false
);

ReactDOM.render(<BasicLayout />, document.getElementById('app'));
