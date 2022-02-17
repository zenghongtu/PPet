import { app } from 'electron'
import Store from 'electron-store'

const store = new Store<{
  alwaysOnTop: boolean
  ignoreMouseEvents: boolean
  showTool: boolean
  language: 'zh' | 'en'
}>({
  name: 'ppet-config',
  defaults: {
    alwaysOnTop: true,
    ignoreMouseEvents: false,
    showTool: true,
    language: app.getLocale().includes('zh') ? 'zh' : 'en',
  },
})

export default store
