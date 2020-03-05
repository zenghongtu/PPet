import React, { useEffect } from 'react';
import './style.scss';
import Plugins from '../modules/Plugins';
import showCodeBoxModal from '../modules/GistBox/modal';
import { Button } from 'antd';

const BasicLayout = () => {
  return (
    <div className="wrap">
      <Button
        onClick={() => {
          showCodeBoxModal();
        }}
      >
        Add
      </Button>
      <Plugins></Plugins>
    </div>
  );
};

export default BasicLayout;
