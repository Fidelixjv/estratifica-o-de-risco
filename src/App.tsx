import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { FamiliasPage } from './pages/FamiliasPage'
import { FamiliaDetalhePage } from './pages/FamiliaDetalhePage'
import { NaoEncontradaPage } from './pages/NaoEncontradaPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/familias" element={<FamiliasPage />} />
          <Route path="/familias/:id" element={<FamiliaDetalhePage />} />
          <Route path="*" element={<NaoEncontradaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
