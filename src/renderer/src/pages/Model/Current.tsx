import React, { FC, useEffect, useLayoutEffect, useRef } from 'react'

export type CurrentType = {
  modelPath: string
  width: number
  height: number
}

const parseModelPath = (p: string) => {
  const paths = p.split('/')
  paths.pop()

  const modelName = paths.pop()
  const basePath = paths.join('/')

  return {
    basePath,
    modelName,
  }
}

const Current: FC<CurrentType> = ({ modelPath, width, height }) => {
  useEffect(() => {
    const { basePath, modelName } = parseModelPath(modelPath)
    new (window as any).l2dViewer({
      el: document.getElementById('live2d'),
      basePath,
      modelName,
      width,
      height,
      autoMotion: true,
    })
  }, [modelPath, width, height])

  return <div id="live2d" className="live2d" key={+new Date()}></div>
}

export default React.memo(Current)
