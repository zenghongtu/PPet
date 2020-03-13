declare module 'electron-positioner';
declare module 'electron-localshortcut';

namespace NodeJS {
  interface Global {
    defaultModelConfigPath: string;
    mainWindow: Electron.BrowserWindow | undefined;
    mainWebContentsId: number | undefined;
    pluginWebContentsId: number | undefined;
    pluginWebContents: Electron.WebContents | undefined;
    __plugins: any;
  }
}
