import React, { FC, useEffect } from 'react'

export type LegacyType = { modelPath: string; width: number; height: number }

const Legacy: FC<LegacyType> = ({ modelPath, height, width }) => {
  useEffect(() => {
    ;(window as any).loadlive2d('live2d', modelPath)
  }, [modelPath, height, width])

  return (
    <canvas
      id="live2d"
      width={width}
      height={height}
      key={+new Date()}
    ></canvas>
  )
}

export default React.memo(Legacy)
