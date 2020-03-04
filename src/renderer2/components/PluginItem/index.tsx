import React, { FunctionComponent } from 'react';
import './style.scss';

export interface IPlugin {
  data: { name: string; code: string; desc?: string };
}
const PluginItem: FunctionComponent<IPlugin> = ({ data }) => {
  const { name, code, desc } = data;

  return (
    <div className="plugin-item">
      <div>{name}</div>
      <div>{desc || '还没有描述~'}</div>
    </div>
  );
};

export default PluginItem;
