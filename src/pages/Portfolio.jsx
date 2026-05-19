import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none">
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #6172f0, #f97316, #8098f7)',
        }}
      />
    </div>
  )
}

function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl card border-subtle flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-110 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ color: 'var(--primary-400)', boxShadow: 'var(--shadow-card)' }}
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}

export default function Portfolio() {
  const location = useLocation()

  useEffect(() => {
    // If there's a hash in the URL on load/navigation, scroll to it
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 72
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background-color 0.35s ease, color 0.35s ease' }}>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
