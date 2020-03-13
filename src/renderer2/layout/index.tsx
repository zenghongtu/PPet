import React, { useEffect, useState, useReducer } from 'react';
import './style.scss';
import Plugins from '../modules/Plugins';
import showCodeBoxModal from '../modules/GistBox/modal';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const BasicLayout = () => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  return (
    <div className="wrap">
      <Button
        type="primary"
        onClick={() => {
          showCodeBoxModal();
        }}
      >
        Add
      </Button>
      <Button
        type="ghost"
        shape="circle-outline"
        onClick={e => {
          forceUpdate();
        }}
      >
        <ReloadOutlined />
      </Button>
      <Plugins refresh={ignored}></Plugins>
    </div>
  );
};

export default BasicLayout;
