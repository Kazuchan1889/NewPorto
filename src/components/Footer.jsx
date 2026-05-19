import { Code2, Link, Share2, Heart } from 'lucide-react'

const navLinks = [
  { label: 'Home',     id: 'home' },
  { label: 'About',    id: 'about' },
  { label: 'Skills',   id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact',  id: 'contact' },
]

const socials = [
  { icon: Code2,  href: 'https://github.com',   label: 'GitHub' },
  { icon: Link,   href: 'https://linkedin.com',  label: 'LinkedIn' },
  { icon: Share2, href: 'https://twitter.com',   label: 'Twitter' },
]

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: 'smooth' })
}

import { useState, useEffect } from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error(err))
  }, [])

  const firstName = heroData?.name ? heroData.name.split(' ')[0] : 'Your'
  const lastName = heroData?.name ? heroData.name.split(' ').slice(1).join(' ') : 'Name'
  const initials = heroData?.name ? heroData.name.substring(0,2).toUpperCase() : 'YN'

  return (
    <footer className="relative" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', transition: 'background-color 0.35s ease, border-color 0.35s ease' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white text-xs group-hover:scale-110 transition-transform">
              {initials}
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {firstName}<span className="gradient-text">{lastName ? ` ${lastName}` : ''}</span>
            </span>
          </button>

          {/* Nav */}
          <nav className="flex flex-wrap gap-5 justify-center">
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm transition-colors duration-300"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-400)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl card border-subtle flex items-center justify-center transition-all duration-300"
                style={{ color: 'var(--text-faint)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-400)'; e.currentTarget.style.borderColor = 'var(--border-brand)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.borderColor = '' }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm flex items-center justify-center gap-1.5 flex-wrap"
             style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-faint)' }}>
          © {year} YourName. Crafted with
          <Heart size={13} className="text-rose-500 fill-rose-500" />
          using React & Tailwind CSS
        </div>
      </div>
    </footer>
  )
}
