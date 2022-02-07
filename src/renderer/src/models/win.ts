import { createModel } from '@rematch/core'
import { RootModel } from '.'

export const win = createModel<RootModel>()({
  state: {
    resizable: false,
  } as { resizable: boolean },
  reducers: {
    setResizable: (state, resizable: boolean) => {
      window.bridge.setWinResizable(resizable)
      return { ...state, resizable }
    },
  },
})
