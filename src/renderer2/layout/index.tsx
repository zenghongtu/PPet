import React, { useEffect } from 'react';
import styles from './style.scss';
import Plugins from '../modules/Plugins';
import showCodeBoxModal from '../modules/GistBox/modal';
import { Button } from 'antd';

const BasicLayout = () => {
  return (
    <div>
      <Button
        onClick={() => {
          showCodeBoxModal();
        }}
      >
        添加
      </Button>
      <Plugins></Plugins>
    </div>
  );
};

export default BasicLayout;
