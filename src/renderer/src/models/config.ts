import { createModel } from '@rematch/core'
import { RootModel } from './'

const initModelPath =
  'file:///Users/jason/Downloads/live2d_models-main/assets/model/moc3/aierdeliqi_4/aierdeliqi_4.model3.json'

export const config = createModel<RootModel>()({
  state: {
    modelPath: initModelPath,
    modelList: [],
  } as { modelPath: string; modelList: string[] },
  reducers: {
    setModelList(state, payload: string[]) {
      return { ...state, modelList: payload }
    },
    setModelPath(state, payload: string) {
      return { ...state, modelPath: payload }
    },
    nextModel(state) {
      const { modelList, modelPath } = state
      let idx = modelList.findIndex((f) => modelPath === f)
      if (idx > -1) {
        if (++idx >= modelList.length) {
          idx = 0
        }
        return { ...state, modelPath: modelList[idx] }
      }
      return state
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload: number, state) {
      console.log('This is current root state', state)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch.count.increment(payload)
    },
  }),
})
