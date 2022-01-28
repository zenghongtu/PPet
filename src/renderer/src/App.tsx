import { Route, Routes } from 'react-router-dom'

import 'font-awesome/css/font-awesome.css'
import { GlobalStyles } from './styles/GlobalStyles'
import Model from './pages/Model'
import Store from './pages/Store'

function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Model />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </>
  )
}

export default App
