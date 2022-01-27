export const debounce = (func: Function, timeout = 500) => {
  let timer: number

  return (...args: any[]) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
