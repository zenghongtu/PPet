import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'

import { models, RootModel } from './models'

const persistConfig = {
  key: 'root',
  storage,
}

const store = init({
  models,
  plugins: [
    persistPlugin<RematchRootState<RootModel>, RootModel>(persistConfig),
  ],
})

export default store

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
