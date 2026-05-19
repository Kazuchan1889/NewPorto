import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Code2, Briefcase, Mail, LogOut, Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Hero Content', path: '/admin/hero', icon: User },
  { label: 'About', path: '/admin/about', icon: User },
  { label: 'Skills', path: '/admin/skills', icon: Code2 },
  { label: 'Projects', path: '/admin/projects', icon: Briefcase },
  { label: 'Contact Settings', path: '/admin/contact-settings', icon: Settings },
  { label: 'Contact Messages', path: '/admin/contact', icon: Mail },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { isDark, toggle } = useTheme()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r flex flex-col" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-xs">
              YN
            </div>
            <span className="font-bold tracking-tight">Admin CMS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const active = pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{ color: active ? 'var(--primary-500)' : 'var(--text-muted)' }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={toggle}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link
            to="/"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
          >
            <LogOut size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b flex items-center px-8" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
          <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {menuItems.find(m => m.path === pathname)?.label || 'Admin Panel'}
          </h1>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
