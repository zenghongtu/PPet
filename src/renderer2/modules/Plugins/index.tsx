import React, { FunctionComponent, useState, useEffect } from 'react';
import './index.scss';
import config from 'common/config';
import { Button } from 'antd';
import showGistBoxModal from '../GistBox/modal';
import { ipcRenderer, remote } from 'electron';

export interface IPlugin {
  data: { name: string; code: string; desc?: string };
}

const initPlugins = config.get('plugins', {});

const Plugins: FunctionComponent = () => {
  const [plugins, setPlugins] = useState(initPlugins);

  useEffect(() => {
    config.onDidChange('plugins', newValue => {
      setPlugins(newValue);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.sendTo(
      remote.getGlobal('mainWebContentsId'),
      'get-active-plugins-message'
    );

    ipcRenderer.on('active-plugins-message', (event, activePlugins = []) => {
      activePlugins.forEach(name => {
        config.set(`plugins.${name}.status`, 'active');
      });
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on('update-plugin-status-message', (event, info) => {
      const { name, status } = info;

      config.set(`plugins.${name}.status`, status);
    });
  }, []);

  const handleEditBtnClick = data => {
    showGistBoxModal(data);
  };

  const handleRemoveBtnClick = data => {
    config.delete(`plugins.${data.name}`);
  };

  const handleChangeStatusBtnClick = data => {
    if (data.status === 'inactive') {
      ipcRenderer.sendTo(
        remote.getGlobal('mainWebContentsId'),
        'add-plugin-message',
        data
      );
    } else if (data.status === 'active') {
      ipcRenderer.sendTo(
        remote.getGlobal('mainWebContentsId'),
        'remove-plugin-message',
        data
      );
    } else {
      console.warn('what???');
    }
  };

  return (
    <div className="plugins">
      {Object.values(plugins).map((item: any) => {
        const { code, name, desc, status, createdAt, updatedAt } = item;

        return (
          <div className="plugin-item" key={name}>
            <div>{name}</div>
            <div>{desc || '...'}</div>
            <Button onClick={handleEditBtnClick.bind(null, item)}>Edit</Button>
            <Button onClick={handleRemoveBtnClick.bind(null, item)}>
              Remove
            </Button>
            <Button onClick={handleChangeStatusBtnClick.bind(null, item)}>
              {status}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default Plugins;
