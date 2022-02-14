import { contextBridge } from 'electron'
import electron from '@electron/remote'
import fs from 'fs/promises'
import path from 'path'
import globby from 'globby'

const getModels = async (file: File) => {
  const filePath = file.path
  if (filePath.endsWith('model.json') || filePath.endsWith('.model3.json')) {
    return [filePath]
  }

  console.log('getModels: ', filePath)
  return fs.stat(filePath).then(async (f) => {
    if (f.isDirectory()) {
      const result = await globby(['**/*model.json', '**.model3.json'], {
        cwd: filePath,
      })
      return result.map((f) => path.join(filePath, f))
    }
    return []
  })
}

const setWinResizable = (resizable: boolean) => {
  electron.getCurrentWindow().setResizable(resizable)
}

const isWinResizable = () => {
  return electron.getCurrentWindow().isResizable()
}

contextBridge.exposeInMainWorld('bridge', {
  __dirname,
  __filename,
  getModels,
  setWinResizable,
  isWinResizable,
})
