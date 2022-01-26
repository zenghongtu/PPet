import { Models } from '@rematch/core'
import { config } from './config'

export interface RootModel extends Models<RootModel> {
  config: typeof config
}

export const models: RootModel = { config }
