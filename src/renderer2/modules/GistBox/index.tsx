import React, { FunctionComponent, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import config from 'common/config';

const { TextArea } = Input;

interface IGistBox {
  data?: {
    name?: string;
    code?: string;
    desc?: string;
  };
  close: () => void;
}

const GistBox: FunctionComponent<IGistBox> = ({ data, close }) => {
  const onFinish = values => {
    const pluginInfo = data
      ? { ...data, ...values, updatedAt: +new Date() }
      : { createdAt: +new Date(), status: 'inactive', ...values };
    config.set(`plugins.${values.name}`, pluginInfo);
    close();
  };

  const onFinishFailed = errorInfo => {
    // TODO
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={data}
    >
      <Form.Item
        name="name"
        label="名称"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <Input autoFocus></Input>
      </Form.Item>
      <Form.Item name="desc" label="描述">
        <Input></Input>
      </Form.Item>
      <Form.Item
        name="code"
        label="代码"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <TextArea autoSize={{ minRows: 15, maxRows: 25 }}></TextArea>
      </Form.Item>

      <div>
        <Button
          onClick={() => {
            close();
          }}
        >
          关闭
        </Button>
        <Button htmlType="submit" type="primary">
          保存
        </Button>
      </div>
    </Form>
  );
};

export default GistBox;
