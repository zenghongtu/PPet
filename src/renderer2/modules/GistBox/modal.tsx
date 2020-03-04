import React from 'react';
import { Modal, Button } from 'antd';
import GistBox from '.';

const showGistBoxModal = (data = null) => {
  const modal = Modal.confirm({});

  const close = () => {
    modal.destroy();
  };

  modal.update({
    okText: '保存',
    cancelText: '关闭',
    width: 600,
    centered: true,
    title: null,
    icon: null,
    content: <GistBox close={close} data={data}></GistBox>,
    okButtonProps: { style: { display: 'none' } },
    cancelButtonProps: { style: { display: 'none' } }
  });
};

export default showGistBoxModal;
