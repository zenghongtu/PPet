import ReactGA from 'react-ga'

ReactGA.initialize('UA-160700616-1', {
  debug: false,
})

ReactGA.pageview(window.location.hash || '/')
