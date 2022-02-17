export {}

declare global {
  interface Window {
    bridge: {
      __dirname: string
      __filename: string
      getModels: (file?: File) => Promise<string[]>
      setWinResizable: (resizable: boolean) => void
      isWinResizable: () => boolean
      onToolbarSwitch: (
        callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
      ) => Electron.IpcRenderer
      getConfig: () => Record<string, any>
    }
  }
}
