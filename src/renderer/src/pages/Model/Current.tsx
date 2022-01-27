import React, { FC, useEffect, useLayoutEffect, useRef } from 'react'

export type CurrentType = {
  basePath: string
  modelName: string
  width: number
  height: number
}

const Current: FC<CurrentType> = ({ basePath, modelName, width, height }) => {
  const l2dRef = useRef<any>(null)

  useEffect(() => {
    const l2d = (l2dRef.current = new (window as any).l2dViewer({
      el: document.getElementById('live2dv3'),
      basePath,
      modelName,
      width,
      height,
      autoMotion: true,
    }))
  }, [basePath, modelName, width, height])

  return <div id="live2dv3" key={+new Date()}></div>
}

export default Current
