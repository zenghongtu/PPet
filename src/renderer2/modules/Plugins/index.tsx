import React, { FunctionComponent, useState, useEffect } from 'react';
import PluginItem from 'renderer2/components/PluginItem';

const Plugins: FunctionComponent = () => {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    // TODO
  }, []);

  return (
    <div>
      <PluginItem></PluginItem>
    </div>
  );
};

export default Plugins;
