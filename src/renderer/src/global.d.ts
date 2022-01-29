export {}

declare global {
  interface Window {
    bridge: {
      __dirname: string
      __filename: string
      getModels: (file?: File) => Promise<string[]>
    }
  }
}
