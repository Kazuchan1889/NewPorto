import { useEffect, useState } from 'react'

export default function Preloader({ progress, logoUrl, onComplete }) {
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
            
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-115"
              />
            ) : (
              /* Fallback to default SVG shield logo */
              <svg viewBox="0 0 716 716" className="w-12 h-12 text-white relative z-10 transition-all duration-300 group-hover:scale-115" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M508.749 317.399C516.777 287.314 508.991 253.884 485.389 230.282C461.788 206.681 428.36 198.895 398.273 206.923C376.231 184.928 343.39 174.956 311.148 183.596C278.906 192.234 255.45 217.292 247.36 247.361C217.291 255.451 192.233 278.91 183.595 311.149C174.957 343.391 184.927 376.232 206.924 398.274C198.896 428.359 206.683 461.789 230.284 485.391C253.885 508.992 287.313 516.779 317.401 508.75C339.442 530.745 372.286 540.717 404.525 532.079C436.767 523.441 460.223 498.384 468.313 468.315C498.383 460.224 523.44 436.766 532.078 404.526C540.716 372.285 530.747 339.443 508.749 317.402V317.399ZM470.899 244.776C486.892 260.77 493.488 282.601 490.687 303.412L415.577 260.046C412.411 258.218 408.509 258.218 405.345 260.046L317.401 310.82V277.526C317.401 275.191 318.652 273.005 320.676 271.837L387.644 233.174C414.178 218.353 448.346 222.223 470.901 244.776H470.899ZM357.837 311.144L398.275 334.491V381.185L357.837 404.532L317.398 381.185V334.491L357.837 311.144ZM264.776 269.693C265.207 239.305 285.644 211.649 316.453 203.393C338.3 197.54 360.505 202.744 377.127 215.573L302.014 258.937C298.848 260.764 296.898 264.144 296.898 267.798V369.346L268.065 352.699C266.043 351.531 264.776 349.353 264.776 347.017V269.691V269.693ZM203.391 316.454C209.244 294.608 224.854 277.978 244.276 269.999V356.73C244.276 360.384 246.226 363.763 249.392 365.591L337.337 416.365L308.503 433.013C306.481 434.181 303.961 434.188 301.939 433.02L234.971 394.357C208.868 378.789 195.138 347.261 203.391 316.454ZM244.775 470.9C228.781 454.906 222.186 433.075 224.986 412.264L300.096 455.63C303.263 457.457 307.164 457.457 310.328 455.63L398.273 404.856V438.149C398.273 440.485 397.022 442.671 394.997 443.839L328.029 482.502C301.495 497.322 267.327 493.452 244.772 470.9H244.775ZM450.897 445.982C450.466 476.371 430.029 504.027 399.22 512.283C377.373 518.136 355.168 512.932 338.547 500.102L413.659 456.738C416.826 454.911 418.775 451.532 418.775 447.877V346.329L447.609 362.977C449.631 364.145 450.897 366.323 450.897 368.659V445.985V445.982ZM512.282 399.221C506.429 421.068 490.819 437.697 471.397 445.676V358.946C471.397 355.292 469.448 351.912 466.281 350.085L378.336 299.311L407.17 282.663C409.192 281.495 411.712 281.487 413.734 282.655L480.702 321.318C506.805 336.887 520.536 368.415 512.282 399.221Z" fill="currentColor" />
              </svg>
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
