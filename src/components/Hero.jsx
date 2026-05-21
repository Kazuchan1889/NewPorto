import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Code2, Link, Share2, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const socials = [
  { icon: Code2,   href: 'https://github.com',   label: 'GitHub' },
  { icon: Link,    href: 'https://linkedin.com',  label: 'LinkedIn' },
  { icon: Share2,  href: 'https://twitter.com',   label: 'Twitter' },
]

// Stats will be fetched from API
// const stats = [
//   { value: '3+',  label: 'Years Exp.' },
//   { value: '20+', label: 'Projects' },
//   { value: '15+', label: 'Clients' },
// ]

export default function Hero({ heroData }) {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dotColor   = isDark ? '128,152,247' : '97,114,240'
      const lineColor  = isDark ? '97,114,240'  : '79,82,229'

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dotColor},${p.alpha})`
        ctx.fill()
        p.x += p.dx; p.y += p.dy
        if (p.x < 0) {
          p.x = 0
          p.dx = Math.abs(p.dx)
        } else if (p.x > canvas.width) {
          p.x = canvas.width
          p.dx = -Math.abs(p.dx)
        }
        if (p.y < 0) {
          p.y = 0
          p.dy = Math.abs(p.dy)
        } else if (p.y > canvas.height) {
          p.y = canvas.height
          p.dy = -Math.abs(p.dy)
        }
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${lineColor},${0.07 * (1 - dist / 90)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [isDark])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-grid" style={{ background: 'var(--bg-base)' }} />
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
           style={{ background: isDark ? 'rgba(97,114,240,0.18)' : 'rgba(97,114,240,0.10)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
           style={{ background: isDark ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.08)', animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-0 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-8 animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
                 style={{ border: '1px solid var(--border-brand)' }}>
              <Sparkles size={14} className="text-primary-400 animate-pulse" />
              <span style={{ color: 'var(--text-secondary)' }}>
                {heroData?.freelance || 'Available for freelance work'}
              </span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <p className="font-mono text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Hello, I'm</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span style={{ color: 'var(--text-primary)' }}>
                  {heroData?.name ? heroData.name.split(' ')[0] + ' ' : 'Your '}
                </span>
                <span className="gradient-text">
                  {heroData?.name ? heroData.name.split(' ').slice(1).join(' ') : 'Name'}
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-transparent" />
                <p className="text-xl md:text-2xl font-light" style={{ color: 'var(--text-secondary)' }}>
                  {(() => {
                    if (!heroData?.title) return (
                      <>
                        Full Stack{' '}
                        <span className="font-semibold" style={{ color: 'var(--primary-400)' }}>
                          Developer
                        </span>
                      </>
                    )
                    const words = heroData.title.trim().split(/\s+/)
                    if (words.length <= 1) {
                      return (
                        <span className="font-semibold" style={{ color: 'var(--primary-400)' }}>
                          {words[0] || ''}
                        </span>
                      )
                    }
                    return (
                      <>
                        {words.slice(0, -1).join(' ')}{' '}
                        <span className="font-semibold" style={{ color: 'var(--primary-400)' }}>
                          {words[words.length - 1]}
                        </span>
                      </>
                    )
                  })()}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text-muted)' }}>
              {heroData?.description || "I craft beautiful, high-performance web applications that blend stunning design with clean, scalable code. Let's build something extraordinary together."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles size={16} />
                View My Work
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline flex items-center gap-2"
              >
                Get In Touch
              </button>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm" style={{ color: 'var(--text-faint)' }}>Follow me:</span>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                   className="w-10 h-10 rounded-xl card border-subtle flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                   style={{ color: 'var(--text-muted)' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-400)')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Right – Avatar */}
          <div className="flex flex-col items-center gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Spinning ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-primary-400 animate-spin-slow opacity-70" style={{ padding: '3px' }}>
                <div className="w-full h-full rounded-full" style={{ background: 'var(--bg-base)' }} />
              </div>
              <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full overflow-hidden border-4 shadow-2xl animate-float"
                   style={{ borderColor: 'var(--bg-base)' }}>
                {heroData?.avatarUrl ? (
                  <img 
                    src={heroData.avatarUrl} 
                    alt="Hero Avatar" 
                    className="w-full h-full object-cover origin-center" 
                    style={{
                      transform: `scale(${heroData.avatarScale ?? 1.0}) translate(${heroData.avatarX ?? 0}%, ${heroData.avatarY ?? 0}%)`
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-700 via-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-8xl font-black text-white/25">
                      {heroData?.name ? heroData.name.substring(0,2).toUpperCase() : 'YN'}
                    </span>
                  </div>
                )}
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2 shadow-xl"
                   style={{ border: '1px solid var(--border-brand)' }}>
                <p className="text-xs font-mono" style={{ color: 'var(--primary-300)' }}>status:</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {heroData?.statusBadge || 'Open to work 🚀'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
              {(heroData?.stats && heroData.stats.length > 0 ? heroData.stats : [
                { value: '3+',  label: 'Years Exp.' },
                { value: '20+', label: 'Projects' },
                { value: '15+', label: 'Clients' },
              ]).map(({ value, label }) => (
                <div key={label} className="card rounded-2xl p-4 text-center border-subtle flex-1 hover:border-brand transition-all duration-300">
                  <p className="text-2xl font-black gradient-text">{value}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-faint)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
           style={{ color: 'var(--text-faint)' }}>
        <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
        <ArrowDown size={14} />
      </div>
    </section>
  )
}
