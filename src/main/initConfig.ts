import { config } from '@src/common'
;(global as any).config = config.store

config.onDidAnyChange((newValue) => {
  ;(global as any).config = newValue || {}
})
