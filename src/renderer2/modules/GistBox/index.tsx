import React, { FunctionComponent, useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

import config from 'common/config';

const { TextArea } = Input;

interface IGistBox {
  data?: {
    name?: string;
    code?: string;
    desc?: string;
    updatedAt?: string;
    createdAt?: string;
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

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  };

  const initFormData = {
    code: `
module.exports = () => {
  // write ...
  
  return () => {
    // clean
  };
};
    `,
    ...data
  };
  return (
    <Form
      {...layout}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initFormData}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <Input placeholder="plugin name" autoFocus></Input>
      </Form.Item>
      <Form.Item name="desc" label="Description">
        <TextArea
          placeholder="plugin description"
          autoSize={{ minRows: 1, maxRows: 4 }}
        ></TextArea>
      </Form.Item>
      <Form.Item
        name="code"
        label="Code"
        rules={[{ required: true, message: 'Please input code!' }]}
      >
        <TextArea
          placeholder="code"
          autoSize={{ minRows: 15, maxRows: 25 }}
        ></TextArea>
      </Form.Item>
      <div>
        {data?.createdAt && (
          <span>created: {new Date(data?.createdAt).toUTCString()}</span>
        )}
        &nbsp;&nbsp;&nbsp;&nbsp;
        {data?.updatedAt && (
          <span>updated:{new Date(data?.updatedAt).toUTCString()}</span>
        )}
      </div>
      <div>
        <Button
          onClick={() => {
            close();
          }}
        >
          Close
        </Button>
        <Button htmlType="submit" type="primary">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default GistBox;
