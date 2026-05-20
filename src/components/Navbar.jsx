import { useState, useEffect, useCallback } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home',     id: 'home' },
  { label: 'About',    id: 'about' },
  { label: 'Skills',   id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact',  id: 'contact' },
]

export default function Navbar() {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('home')
  const [heroData, setHeroData]   = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error(err))
  }, [])

  /* ── Track which section is in view ───────────────────────── */
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Auto-highlight active section based on scroll position
      const offsets = navLinks.map(({ id }) => {
        const el = document.getElementById(id)
        return { id, top: el ? el.getBoundingClientRect().top : Infinity }
      })
      const current = offsets.filter((o) => o.top <= 120).at(-1)
      if (current) setActive(current.id)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // trigger once on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  /* ── Smooth scroll helper ─────────────────────────────────── */
  const handleNavClick = useCallback((id) => {
    setMenuOpen(false)
    if (!isHome) {
      navigate(`/#${id}`)
    } else {
      const el = document.getElementById(id)
      if (!el) return

      const navHeight = 72 // px – approx navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight

      window.scrollTo({ top, behavior: 'smooth' })
      setActive(id)
    }
  }, [isHome, navigate])

  const navBg = scrolled || !isHome
    ? isDark
      ? 'bg-dark-900/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/40 py-3'
      : 'bg-white/80 backdrop-blur-2xl border-b border-primary-500/10 shadow-lg shadow-primary-500/5 py-3'
    : 'py-5 bg-transparent'

  const firstName = heroData?.name ? heroData.name.split(' ')[0] : 'Your'
  const lastName = heroData?.name ? heroData.name.split(' ').slice(1).join(' ') : 'Name'
  const initials = heroData?.name ? heroData.name.substring(0,2).toUpperCase() : 'YN'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────── */}
        <button onClick={() => handleNavClick('home')} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-sm group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30">
            {heroData?.avatarUrl ? (
              <img src={heroData.avatarUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {firstName}<span className="gradient-text">{lastName ? ` ${lastName}` : ''}</span>
          </span>
        </button>

        {/* ── Desktop Nav ──────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => handleNavClick(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  active === id && isHome ? 'nav-active' : ''
                }`}
                style={{
                  color: (active === id && isHome) ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  if (active !== id || !isHome) e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  if (active !== id || !isHome) e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Right controls ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-500 flex items-center ${
              isDark
                ? 'bg-primary-600 shadow-md shadow-primary-500/30'
                : 'bg-light-300 shadow-md shadow-primary-200/60'
            }`}
          >
            <span
              className={`absolute flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-500 ${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              {isDark
                ? <Moon size={10} className="text-primary-600" />
                : <Sun size={10} className="text-accent-500" />
              }
            </span>
            <Sun  size={12} className={`absolute left-2 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'text-accent-400 opacity-100'}`} />
            <Moon size={12} className={`absolute right-2 transition-opacity duration-300 ${isDark ? 'text-primary-200 opacity-100' : 'opacity-0'}`} />
          </button>

          <button onClick={() => navigate('/admin')} className="btn-outline text-sm py-2.5 px-4" style={{ padding: '8px 16px', borderRadius: '8px', borderWidth: '1px' }}>
            Admin CMS
          </button>
          
          <button onClick={() => handleNavClick('contact')} className="btn-primary text-sm py-2.5 px-6">
            Hire Me
          </button>
        </div>

        {/* ── Mobile: theme + hamburger ─────────────────────── */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="text-xs font-semibold px-3 py-1.5 rounded-lg border-subtle border" style={{ color: 'var(--text-muted)' }}>
            CMS
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 card border-subtle"
          >
            {isDark
              ? <Sun size={16} className="text-accent-400" />
              : <Moon size={16} className="text-primary-500" />
            }
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 card border-subtle"
            style={{ color: 'var(--text-muted)' }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────── */}
      <div
        className={`md:hidden mx-4 mt-2 rounded-2xl overflow-hidden transition-all duration-400 card ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <ul className="p-4 flex flex-col gap-1">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => handleNavClick(id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active === id && isHome ? 'nav-active' : ''
                }`}
                style={{ color: (active === id && isHome) ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {label}
              </button>
            </li>
          ))}
          <li className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => handleNavClick('contact')}
              className="btn-primary w-full text-sm"
            >
              Hire Me
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
