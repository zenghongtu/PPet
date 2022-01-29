import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { Dispatch } from '../../store'
import { TipsType } from './Tips'

const Wrapper = styled.div`
  color: #aaa;
  opacity: 0;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 1s;

  & span {
    color: #6a6a6a;
    display: block;
    line-height: 30px;
    text-align: center;
    transition: color 0.3s;
    cursor: pointer;

    &:hover {
      color: #fa0;
      opacity: 1;
    }
  }

  &:hover {
    opacity: 1;
  }
`

const MoveIcon = styled.span`
  -webkit-app-region: drag;
`

const Toolbar: FC<{
  onShowMessage: (tips: TipsType) => void
}> = ({ onShowMessage }) => {
  const dispatch = useDispatch<Dispatch>()
  const showMessage = (text: string, timeout: number, priority: number) => {
    onShowMessage({ text, priority, timeout })
  }
  const showHitokoto = () => {
    fetch('https://v1.hitokoto.cn')
      .then((response) => response.json())
      .then((result) => {
        showMessage(result.hitokoto, 6000, 10)

        const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`

        window.setTimeout(() => {
          showMessage(text, 6000, 10)
        }, 6000)
      })
  }
  const loadOtherModel = () => {
    dispatch.config.nextModel()
  }
  const capture = () => {}
  const showInfo = () => {}

  const toolList = [
    { name: 'comment', icon: 'comment', call: showHitokoto },
    {
      name: 'user',
      icon: 'user-circle',
      call: loadOtherModel,
    },
    { name: 'camera', icon: 'camera-retro', call: capture },
    { name: 'info', icon: 'info-circle', call: showInfo },
  ]

  return (
    <Wrapper>
      {toolList.map((item) => {
        const { name, icon, call } = item
        return (
          <span
            onClick={() => {
              call()
            }}
            key={name}
            className={`fa fa-lg fa-${icon}`}
          ></span>
        )
      })}
      <MoveIcon className="fa fa-lg fa-arrows" aria-hidden="true"></MoveIcon>
    </Wrapper>
  )
}

export default Toolbar
