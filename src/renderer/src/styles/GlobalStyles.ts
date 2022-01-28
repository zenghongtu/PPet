import { createGlobalStyle } from 'styled-components'
import Variables from './Variables'

export const GlobalStyles = createGlobalStyle`
  ${Variables};

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    -webkit-user-select: none;
  }

  // Scrollbar styles
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--black);
  }
`
