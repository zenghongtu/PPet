import { createModel } from '@rematch/core'
import { RootModel } from '.'

export const win = createModel<RootModel>()({
  state: {
    resizable: window.bridge.isWinResizable(),
  } as { resizable: boolean },
  reducers: {
    setResizable: (state, resizable: boolean) => {
      window.bridge.setWinResizable(resizable)
      return { ...state, resizable }
    },
  },
})
