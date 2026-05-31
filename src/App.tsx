import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import Layout from './pages/Layout'
import RegistroPage from './pages/RegistroPage'
import HistorialPage from './pages/HistorialPage'
import EvolucionPage from './pages/EvolucionPage'

function ProtectedLayout() {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-tremor-content">
      Cargando...
    </div>
  )
  return session ? <Layout /> : <Navigate to="/auth" replace />
}

function AppRoutes() {
  const { session, loading, error } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-tremor-background-subtle flex items-center justify-center text-tremor-content">
      Cargando...
    </div>
  )
  if (error) return (
    <div className="min-h-screen bg-tremor-background-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-tremor-default border border-red-200 bg-tremor-background p-6 shadow-tremor-card">
        <h1 className="text-tremor-default font-semibold text-red-700">No se pudo conectar con Supabase</h1>
        <p className="mt-2 text-tremor-default text-tremor-content">{error}</p>
      </div>
    </div>
  )
  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/registro" replace /> : <AuthPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/evolucion" element={<EvolucionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/registro" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
