import { Models } from '@rematch/core'
import { config } from './config'
import { win } from './win'

export interface RootModel extends Models<RootModel> {
  config: typeof config
  win: typeof win
}

export const models: RootModel = { config, win }
