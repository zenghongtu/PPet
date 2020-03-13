import React, { FunctionComponent, useState, useEffect } from 'react';
import './index.scss';
import config from 'common/config';
import { Button } from 'antd';
import showGistBoxModal from '../GistBox/modal';
import { ipcRenderer, remote } from 'electron';

export interface IPlugin {
  data: { name: string; code: string; desc?: string };
}

const pluginsUrl =
  'https://raw.githubusercontent.com/zenghongtu/PPet/master/plugins';

const initPlugins = config.get('plugins', {});

// 移除无效plugin
Object.keys(initPlugins).forEach((name: any) => {
  if (!initPlugins[name].code) {
    config.delete(`plugins.${name}`);
  }
});

const Plugins: FunctionComponent = () => {
  const [plugins, setPlugins] = useState(initPlugins);

  useEffect(() => {
    const unsubscribe = config.onDidChange('plugins', newValue => {
      setPlugins({ ...plugins, ...newValue });
    });
    return () => {
      unsubscribe();
    };
  }, [plugins]);

  useEffect(() => {
    fetch(`${pluginsUrl}/index.json`)
      .then(rsp => rsp.json())
      .then(data => {
        const _plugins = { ...plugins };
        data.forEach(item => {
          if (!_plugins[item.name]) {
            _plugins[item.name] = item;
          }
        });
        setPlugins(_plugins);
      });
  }, []);

  useEffect(() => {
    ipcRenderer.send('get-active-plugins-message');

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
    if (!data.code) {
      const url = `${pluginsUrl}/${data.path}`;
      fetch(url)
        .then(rsp => rsp.text())
        .then(code => {
          const _plugin = {
            createdAt: +new Date(),
            status: 'inactive',
            name: data.name,
            code: code,
            desc: data.desc
          };

          showGistBoxModal(_plugin);
        });
    } else {
      showGistBoxModal(data);
    }
  };

  const handleRemoveBtnClick = data => {
    if (data.status === 'active') {
      handleChangeStatusBtnClick(data);
    }
    config.delete(`plugins.${data.name}`);
  };

  const handleChangeStatusBtnClick = data => {
    if (data.code) {
      if (data.status === 'inactive') {
        ipcRenderer.send('add-plugin-message', data);
      } else if (data.status === 'active') {
        ipcRenderer.send('remove-plugin-message', data);
      }
    } else if (data.path) {
      const url = `${pluginsUrl}/${data.path}`;
      fetch(url)
        .then(rsp => rsp.text())
        .then(code => {
          const _plugin = {
            createdAt: +new Date(),
            status: 'inactive',
            name: data.name,
            code: code,
            desc: data.desc
          };

          config.set(`plugins.${data.name}`, _plugin);

          handleChangeStatusBtnClick(_plugin);
        });
    } else {
      console.warn('what???');
    }
  };

  return (
    <div className="plugins">
      {Object.values(plugins)
        .sort()
        .map((item: any) => {
          const { code, name, path, desc, status, createdAt, updatedAt } = item;

          return (
            <div className="plugin-item" key={name}>
              {!code && 'online'}
              <div className="name">name: {name}</div>
              <div className="desc">desc: {desc || ' '}</div>
              <div className="buttons">
                <Button onClick={handleEditBtnClick.bind(null, item)}>
                  edit
                </Button>
                {code && (
                  <Button
                    onClick={handleRemoveBtnClick.bind(null, item)}
                    type="dashed"
                  >
                    Delete
                  </Button>
                )}
                <Button
                  onClick={handleChangeStatusBtnClick.bind(null, item)}
                  type={status === 'active' ? 'danger' : 'primary'}
                >
                  {status === 'active' ? 'stop' : 'run'}
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Plugins;
