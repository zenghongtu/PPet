import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { debounce } from '@src/renderer/src/utils'
import LegacyRender from './Legacy'
import CurrentRender from './Current'
import Toolbar from './Toolbar'

const Wrapper = styled.div`
  border: 1px double #ccc;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`

const Model = () => {
  const [modelPath, setModelPath] = useState(
    'file:///Users/jason/Downloads/live2d_models-main/assets/model/moc3/aierdeliqi_4/aierdeliqi_4.model3.json',
  )
  const [cavSize, setCavSize] = useState({ height: 900, width: 800 })

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
      setCavSize({
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
      })
    })

    window.addEventListener('resize', resizeCanvas, false)

    resizeCanvas()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const Render = modelPath.endsWith('.model3.json')
    ? CurrentRender
    : LegacyRender

  return (
    <Wrapper>
      <Toolbar></Toolbar>
      <Render {...cavSize} modelPath={modelPath}></Render>
    </Wrapper>
  )
}

export default Model
