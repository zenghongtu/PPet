import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import persistPlugin from '@rematch/persist'
import { PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from 'redux-state-sync'

import { models, RootModel } from './models'

const persistConfig: PersistConfig<
  RematchRootState<RootModel, Record<string, never>>,
  any,
  any,
  any
> = {
  key: 'root',
  storage,
  whitelist: ['config'],
}

const store = init({
  redux: { middlewares: [createStateSyncMiddleware({})] },
  models,
  plugins: [
    persistPlugin<RematchRootState<RootModel>, RootModel>(persistConfig),
  ],
})

initStateWithPrevTab(store)

export default store

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
