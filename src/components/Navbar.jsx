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
            {heroData?.logoUrl ? (
              <img src={heroData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <svg viewBox="0 0 716 716" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M508.749 317.399C516.777 287.314 508.991 253.884 485.389 230.282C461.788 206.681 428.36 198.895 398.273 206.923C376.231 184.928 343.39 174.956 311.148 183.596C278.906 192.234 255.45 217.292 247.36 247.361C217.291 255.451 192.233 278.91 183.595 311.149C174.957 343.391 184.927 376.232 206.924 398.274C198.896 428.359 206.683 461.789 230.284 485.391C253.885 508.992 287.313 516.779 317.401 508.75C339.442 530.745 372.286 540.717 404.525 532.079C436.767 523.441 460.223 498.384 468.313 468.315C498.383 460.224 523.44 436.766 532.078 404.526C540.716 372.285 530.747 339.443 508.749 317.402V317.399ZM470.899 244.776C486.892 260.77 493.488 282.601 490.687 303.412L415.577 260.046C412.411 258.218 408.509 258.218 405.345 260.046L317.401 310.82V277.526C317.401 275.191 318.652 273.005 320.676 271.837L387.644 233.174C414.178 218.353 448.346 222.223 470.901 244.776H470.899ZM357.837 311.144L398.275 334.491V381.185L357.837 404.532L317.398 381.185V334.491L357.837 311.144ZM264.776 269.693C265.207 239.305 285.644 211.649 316.453 203.393C338.3 197.54 360.505 202.744 377.127 215.573L302.014 258.937C298.848 260.764 296.898 264.144 296.898 267.798V369.346L268.065 352.699C266.043 351.531 264.776 349.353 264.776 347.017V269.691V269.693ZM203.391 316.454C209.244 294.608 224.854 277.978 244.276 269.999V356.73C244.276 360.384 246.226 363.763 249.392 365.591L337.337 416.365L308.503 433.013C306.481 434.181 303.961 434.188 301.939 433.02L234.971 394.357C208.868 378.789 195.138 347.261 203.391 316.454ZM244.775 470.9C228.781 454.906 222.186 433.075 224.986 412.264L300.096 455.63C303.263 457.457 307.164 457.457 310.328 455.63L398.273 404.856V438.149C398.273 440.485 397.022 442.671 394.997 443.839L328.029 482.502C301.495 497.322 267.327 493.452 244.772 470.9H244.775ZM450.897 445.982C450.466 476.371 430.029 504.027 399.22 512.283C377.373 518.136 355.168 512.932 338.547 500.102L413.659 456.738C416.826 454.911 418.775 451.532 418.775 447.877V346.329L447.609 362.977C449.631 364.145 450.897 366.323 450.897 368.659V445.985V445.982ZM512.282 399.221C506.429 421.068 490.819 437.697 471.397 445.676V358.946C471.397 355.292 469.448 351.912 466.281 350.085L378.336 299.311L407.17 282.663C409.192 281.495 411.712 281.487 413.734 282.655L480.702 321.318C506.805 336.887 520.536 368.415 512.282 399.221Z" fill="currentColor" />
              </svg>
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
