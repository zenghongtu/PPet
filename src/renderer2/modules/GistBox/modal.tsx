import React from 'react';
import { Modal, Button } from 'antd';
import GistBox from '.';

const showGistBoxModal = (data: any = null) => {
  const modal = Modal.confirm({});

  const close = () => {
    modal.destroy();
  };

  modal.update({
    okText: 'save',
    cancelText: 'close',
    width: 800,
    maskClosable: true,
    centered: true,
    title: null,
    icon: null,
    content: <GistBox close={close} data={data}></GistBox>,
    okButtonProps: { style: { display: 'none' } },
    cancelButtonProps: { style: { display: 'none' } }
  });
};

export default showGistBoxModal;
