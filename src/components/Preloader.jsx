import { useEffect, useState } from 'react'

export default function Preloader({ progress, avatarUrl, onComplete }) {
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
            
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Logo" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-115"
              />
            ) : (
              /* Fallback to default Base64 logo */
              <img 
                src="data:image/png;base64,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" 
                alt="Logo" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-115"
              />
            )}
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
