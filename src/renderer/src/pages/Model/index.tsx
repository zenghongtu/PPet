import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { debounce } from '@src/renderer/src/utils'
import Legacy from './Legacy'
import Current from './Current'
import Toolbar from './Toolbar'

const Wrapper = styled.div`
  border: 1px double #ccc;
`

const Model = () => {
  const [modelVersion, setModelVersion] = useState('3')
  const [cavSize, setCavSize] = useState({ height: 900, width: 800 })

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

  return (
    <Wrapper>
      <Toolbar></Toolbar>
      {modelVersion !== '3' ? (
        <Legacy
          {...cavSize}
          modelPath={`file:///Users/jason/Downloads/live2d_models-main/assets/model/moc/rem/model.json`}
        ></Legacy>
      ) : (
        <Current
          {...cavSize}
          basePath="file:///Users/jason/Downloads/live2d_models-main/assets/model/moc3"
          modelName="aierdeliqi_4"
        ></Current>
      )}
    </Wrapper>
  )
}

export default Model
