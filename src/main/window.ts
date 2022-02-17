import { app, BrowserWindow } from 'electron'
import { join } from 'path'

export const winPagePathMap: Map<string, BrowserWindow> = new Map()

export async function createWindow(
  options: Electron.BrowserWindowConstructorOptions,
  pagePath: string = '',
) {
  const lastWin = winPagePathMap.get(pagePath)
  if (lastWin && !lastWin.isDestroyed()) {
    lastWin.focus()
    return
  }

  const win = new BrowserWindow({ ...options, show: false })

  if (app.isPackaged) {
    const file = join(__dirname, '../renderer/index.html')

    win.loadFile(file, { hash: pagePath })
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${
      pkg.env.PORT
    }#${pagePath}`

    win.loadURL(url, {
      // userAgent:
      //   'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/603.1.23 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
    })
    win.webContents.openDevTools()
  }

  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })

  winPagePathMap.set(pagePath, win)

  return win
}
