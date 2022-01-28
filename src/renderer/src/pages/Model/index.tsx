import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { debounce } from '@src/renderer/src/utils'
import LegacyRender from './Legacy'
import CurrentRender from './Current'
import Toolbar from './Toolbar'
import Tips, { TipsType } from './Tips'

const Wrapper = styled.div`
  border: 1px double #ccc;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

const RenderWrapper = styled.div`
  margin-top: 20px;
`

const getCavSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight - 20,
  }
}

const Model = () => {
  const [tips, setTips] = useState<TipsType>({
    text: '',
    priority: -1,
    timeout: 0,
  })
  const [modelPath, setModelPath] = useState(
    'file:///Users/jason/Downloads/live2d_models-main/assets/model/moc3/aierdeliqi_4/aierdeliqi_4.model3.json',
  )
  const [cavSize, setCavSize] =
    useState<{ width: number; height: number }>(getCavSize)

  useEffect(() => {
    const handleDragOver = (evt: DragEvent): void => {
      evt.preventDefault()
    }
    const handleDrop = (evt: DragEvent): void => {
      evt.preventDefault()

      const file = evt.dataTransfer?.files?.[0]
      if (file?.type === 'application/json') {
        setModelPath(`file://${file.path}`)
      }
    }

    document.body.addEventListener('dragover', handleDragOver)
    document.body.addEventListener('drop', handleDrop)

    return () => {
      document.body.removeEventListener('dragover', handleDragOver)
      document.body.removeEventListener('drop', handleDrop)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeCanvas = debounce(() => {
      setCavSize(getCavSize())
    })

    window.addEventListener('resize', resizeCanvas, false)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const Render = modelPath.endsWith('.model3.json')
    ? CurrentRender
    : LegacyRender

  const handleMessageChange = (nextTips: TipsType) => {
    if (nextTips.priority >= tips.priority) {
      setTips(nextTips)
    }
  }

  return (
    <Wrapper>
      <Tips {...tips}></Tips>
      <Toolbar onShowMessage={handleMessageChange}></Toolbar>
      <RenderWrapper>
        <Render {...cavSize} modelPath={modelPath}></Render>
      </RenderWrapper>
    </Wrapper>
  )
}

export default Model
