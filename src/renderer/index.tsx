import { remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BasicLayout from './layouts/BasicLayout';
import './index.scss';

const { Menu, MenuItem, app, getCurrentWindow } = remote;

const menu = new Menu();

menu.append(
  new MenuItem({
    label: '@置顶',
    type: 'checkbox',
    checked: true,
    click: item => {
      const { checked } = item;
      getCurrentWindow().setAlwaysOnTop(checked);
    }
  })
);

menu.append(
  new MenuItem({
    label: '退出',
    click: item => {
      app.quit();
    }
  })
);

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
    menu.popup({ window: remote.getCurrentWindow() });
  },
  false
);

ReactDOM.render(<BasicLayout />, document.getElementById('app'));
