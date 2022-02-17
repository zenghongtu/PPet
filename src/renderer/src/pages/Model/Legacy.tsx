import React, { FC, useEffect, useRef } from 'react'

export type LegacyType = { modelPath: string; width: number; height: number }

const Legacy: FC<LegacyType> = ({ modelPath, height, width }) => {
  const isMountRef = useRef(false)

  useEffect(() => {
    ;(window as any).loadlive2d('live2d', modelPath)
  }, [modelPath])

  useEffect(() => {
    //  使用 key={+new Date()} 会导致渲染模型不完整，这里暂时对窗口改变时进行刷新
    // TODO
    if (isMountRef.current) {
      window.location.reload()
    } else {
      isMountRef.current = true
    }
  }, [height, width])

  return (
    <canvas
      id={'live2d'}
      className="live2d"
      width={width}
      height={height}
    ></canvas>
  )
}

export default React.memo(Legacy)
