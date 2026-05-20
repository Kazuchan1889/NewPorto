import { useEffect, useState } from 'react'

export default function Preloader({ progress, onComplete }) {
  const [fade, setFade] = useState(false)
  const [statusText, setStatusText] = useState('Initializing...')
  
  // Interactive Tilt and Ripples States
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false })
  const [ripples, setRipples] = useState([])

  useEffect(() => {
    if (progress < 20) {
      setStatusText('Connecting to database...')
    } else if (progress < 40) {
      setStatusText('Fetching profile & bio...')
    } else if (progress < 60) {
      setStatusText('Loading skill categories...')
    } else if (progress < 80) {
      setStatusText('Loading projects and artwork...')
    } else if (progress < 100) {
      setStatusText('Structuring layout...')
    } else {
      setStatusText('Ready!')
      const timeout = setTimeout(() => {
        setFade(true)
        const removeTimeout = setTimeout(() => {
          onComplete()
        }, 500)
        return () => clearTimeout(removeTimeout)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  // Mouse Move Tilt Calculation
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Max tilt angles (degrees)
    const rotateX = -(y / (rect.height / 2)) * 30
    const rotateY = (x / (rect.width / 2)) * 30
    setTilt({ x: rotateX, y: rotateY, active: true })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false })
  }

  // Click Shockwave Trigger
  const handleClick = () => {
    const id = Date.now()
    setRipples(prev => [...prev, id])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r !== id))
    }, 1000)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-all duration-700 ease-in-out ${
        fade ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#07080d',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}
    >
      {/* Keyframe Stylesheets for animations */}
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(97, 114, 240, 0.35), inset 0 0 15px rgba(97, 114, 240, 0.15); }
          50% { box-shadow: 0 0 35px rgba(249, 115, 22, 0.5), inset 0 0 25px rgba(249, 115, 22, 0.25); }
        }
        @keyframes ripple-effect {
          from { transform: scale(0.6); opacity: 0.9; }
          to { transform: scale(2.6); opacity: 0; }
        }
        @keyframes grid-glow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
      `}</style>

      {/* Background Glow Blobs */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[110px] bg-primary-500/10 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-[130px] bg-accent-500/10 animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Decorative Interactive Grid Overlay */}
      <div 
        className="absolute inset-0 bg-grid pointer-events-none" 
        style={{ animation: 'grid-glow 6s infinite ease-in-out' }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        
        {/* 3D Interactive Logo Section */}
        <div
          className="relative mb-12 flex items-center justify-center cursor-pointer group"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{
            transform: tilt.active
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.12)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: tilt.active ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            animation: tilt.active ? 'none' : 'float-logo 4s ease-in-out infinite'
          }}
        >
          {/* Outer Dashed Orbiting Ring 1 */}
          <div 
            className="absolute w-32 h-32 rounded-full border border-dashed pointer-events-none" 
            style={{
              borderColor: 'rgba(97, 114, 240, 0.35)',
              animation: 'spin-clockwise 14s linear infinite'
            }}
          />

          {/* Inner Dashed Orbiting Ring 2 */}
          <div 
            className="absolute w-28 h-28 rounded-full border border-dashed pointer-events-none" 
            style={{
              borderColor: 'rgba(249, 115, 22, 0.25)',
              borderWidth: '2px',
              animation: 'spin-counter 10s linear infinite'
            }}
          />

          {/* Shockwave Ripples (Triggered on click) */}
          {ripples.map(id => (
            <span
              key={id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '90px',
                height: '90px',
                background: 'radial-gradient(circle, rgba(97, 114, 240, 0.45) 0%, transparent 70%)',
                border: '2px dashed rgba(97, 114, 240, 0.55)',
                animation: 'ripple-effect 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards'
              }}
            />
          ))}

          {/* Deep Blur Shadow Aura */}
          <div className="absolute inset-2 rounded-3xl blur-xl opacity-80 bg-gradient-to-br from-primary-500 to-accent-500 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />

          {/* Core Shield */}
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center relative bg-[#090a10] border overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.08)',
              animation: 'pulse-glow 3s ease-in-out infinite'
            }}
          >
            {/* Shimmer light bar across logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Initial Letter */}
            <span 
              className="text-3xl font-black text-white tracking-wider relative z-10 transition-transform duration-300 group-hover:scale-115"
              style={{
                textShadow: '0 0 12px rgba(255, 255, 255, 0.45)'
              }}
            >
              P
            </span>
          </div>
        </div>

        {/* Loading Progress Percentage */}
        <div className="mb-2">
          <span className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent font-mono">
            {Math.min(100, Math.round(progress))}%
          </span>
        </div>

        {/* Dynamic Status Text */}
        <div className="h-6 mb-8">
          <p className="text-xs font-mono tracking-wider uppercase" style={{ color: '#8d92ad' }}>
            {statusText}
          </p>
        </div>

        {/* Modern Sleek Progress Bar */}
        <div className="w-56 h-[4px] rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 shadow-[0_0_8px_rgba(97,114,240,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
