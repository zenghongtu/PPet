import React, { useEffect, useLayoutEffect, useRef } from 'react'

const Model = () => {
  const cavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // @ts-ignore
    // new l2dViewer({
    //   el: cavRef.current,
    //   basePath:
    //     'https://raw.githubusercontent.com//assets/model/moc3',
    //   modelName: 'lafei_4',
    //   width: 1500,
    //   height: 900,
    //   autoMotion: true,
    // })

    loadlive2d(
      'live2d',
      // `https://raw.githubusercontent.com//assets/model/moc/platelet/model.json`,
    )
  }, [])

  return (
    <div>
      <canvas id="live2d" width="800" height="800"></canvas>
      <div style={{ height: '100vh', width: '100vw' }} ref={cavRef}></div>
    </div>
  )
}

export default Model
