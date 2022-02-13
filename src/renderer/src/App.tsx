import { Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.css'

import { GlobalStyles } from './styles/GlobalStyles'
import Model from './pages/Model'
import Setting from './pages/Setting'
import store from './store'

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Model />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Provider>
  )
}

export default App
