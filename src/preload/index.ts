import { contextBridge } from 'electron'
import electron from '@electron/remote'

contextBridge.exposeInMainWorld('bridge', {
  __dirname,
  __filename,
  getCurrentWindow: electron.getCurrentWindow,
})
