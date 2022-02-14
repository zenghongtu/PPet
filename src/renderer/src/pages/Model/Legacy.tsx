import React, { FC, useEffect, useRef } from 'react'

export type LegacyType = { modelPath: string; width: number; height: number }

const Legacy: FC<LegacyType> = ({ modelPath, height, width }) => {
  // 只在 height、width 变化时产生变化时生成新的 id
  const live2dId = `live2d-${height}-${width}`

  useEffect(() => {
    ;(window as any).loadlive2d(live2dId, modelPath)
  }, [modelPath, height, width])

  return (
    <canvas
      id={live2dId}
      className="live2d"
      width={width}
      height={height}
    ></canvas>
  )
}

export default React.memo(Legacy)
