import { useEffect, useState } from 'react'

export default function Preloader({ progress, onComplete }) {
  const [fade, setFade] = useState(false)
  const [statusText, setStatusText] = useState('Initializing...')

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
      // Trigger fade out
      const timeout = setTimeout(() => {
        setFade(true)
        // Completely remove preloader after fade animation (500ms)
        const removeTimeout = setTimeout(() => {
          onComplete()
        }, 500)
        return () => clearTimeout(removeTimeout)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-all duration-700 ease-in-out ${
        fade ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#0a0b10',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}
    >
      {/* Background Glow Blobs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[100px] bg-primary-500/10 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[120px] bg-accent-500/10 animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Decorative Tech Grid Overlay */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Pulsing Logo Bracket */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Ripple Rings */}
          <div className="absolute w-24 h-24 rounded-full border border-primary-500/20 animate-ping opacity-75" />
          <div className="absolute w-32 h-32 rounded-full border border-accent-500/10 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
          
          {/* Core Shield/Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative bg-gradient-to-br from-primary-600 to-accent-500 shadow-primary-500/25">
            <span className="text-2xl font-black text-white tracking-wider animate-pulse">P</span>
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
