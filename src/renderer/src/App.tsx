import { GlobalStyles } from './styles/GlobalStyles'
import { Route, Routes } from 'react-router-dom'
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
