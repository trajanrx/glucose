import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/registro', label: 'Registro' },
  { to: '/historial', label: 'Historial' },
  { to: '/evolucion', label: 'Evolución' },
] as const

export default function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-tremor-background-subtle">
      <header className="bg-tremor-background border-b border-tremor-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-tremor-title font-bold text-tremor-content-strong">Control de glucosa</h1>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-tremor-label text-tremor-content">{user?.email}</span>
              <button
                onClick={signOut}
                className="rounded-tremor-small border border-tremor-border bg-tremor-background px-3 py-1.5 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <nav className="flex gap-1">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-tremor-default font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-tremor-brand text-tremor-brand'
                      : 'border-transparent text-tremor-content hover:text-tremor-content-strong'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
