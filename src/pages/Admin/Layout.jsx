import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, User, Code2, Briefcase, Mail, LogOut, Moon, Sun, Settings, Menu, X } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar overlay is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const currentLabel = menuItems.find(m => m.path === pathname)?.label || 'Admin Panel'

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Mobile Overlay Backdrop ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-xs">
              YN
            </div>
            <span className="font-bold tracking-tight">Admin CMS</span>
          </Link>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
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

        {/* Sidebar Footer */}
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

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto min-w-0">
        {/* Top Header Bar */}
        <header
          className="h-16 border-b flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 card border-subtle"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <h1 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {currentLabel}
          </h1>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
