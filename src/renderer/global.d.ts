declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare const __static: string;
declare const loadlive2d: any;
declare const Live2D: any;

interface Window {
  __plugins: { [name: string]: any };
}
