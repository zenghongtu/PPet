import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Checkbox, Input } from 'antd'

import { Dispatch, RootState } from '../../store'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px;
`

const TextAreaWrapStyled = styled.div`
  margin-bottom: 10px;
  & > textarea {
    white-space: nowrap;
  }
`

const Setting = () => {
  const dispatch = useDispatch<Dispatch>()
  const { modelPath, modelList, useGhProxy } = useSelector(
    (state: RootState) => state.config,
  )

  const [value, setValue] = useState(() => modelList.join('\n'))

  const handleClickConfirmBtn = () => {
    const models = value.split('\n').filter(Boolean)
    dispatch.config.setModelList(models)
    dispatch.config.setModelPath(models[0])
  }

  return (
    <Wrapper>
      模型列表：
      <TextAreaWrapStyled>
        <Input.TextArea
          rows={8}
          value={value}
          onChange={(ev) => {
            setValue(ev.target.value)
          }}
        ></Input.TextArea>
      </TextAreaWrapStyled>
      <Button type="primary" onClick={handleClickConfirmBtn}>
        确定
      </Button>
      <br />
      <Checkbox
        checked={useGhProxy}
        onChange={(ev) => {
          const enable = ev.target.checked
          dispatch.config.setUseGhProxy(enable)
        }}
      >
        使用
        <a href="https://ghproxy.com" target="_blank">
          ghproxy
        </a>
        加速
      </Checkbox>
    </Wrapper>
  )
}

export default Setting
