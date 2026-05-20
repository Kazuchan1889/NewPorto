import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Preloader from '../components/Preloader'
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

  // API Data states
  const [heroData, setHeroData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [skillsData, setSkillsData] = useState(null)
  const [projectsData, setProjectsData] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)

  // Loading states
  const [progress, setProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const [showPreloader, setShowPreloader] = useState(true)

  // Fetch all endpoints
  useEffect(() => {
    const endpoints = [
      { url: '/api/hero', setter: setHeroData },
      { url: '/api/about', setter: setAboutData },
      { url: '/api/skills', setter: setSkillsData },
      { url: '/api/projects', setter: setProjectsData },
      { url: '/api/contact-info', setter: setContactInfo }
    ]

    let completed = 0
    const total = endpoints.length

    endpoints.forEach(({ url, setter }) => {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`)
          return res.json()
        })
        .then(data => setter(data))
        .catch(err => console.error(`Failed to fetch ${url}:`, err))
        .finally(() => {
          completed += 1
          setTargetProgress((completed / total) * 100)
        })
    })
  }, [])

  // Smooth out the progress bar
  useEffect(() => {
    if (progress < targetProgress) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 1, targetProgress))
      }, 8)
      return () => clearTimeout(timer)
    }
  }, [progress, targetProgress])

  // Scroll logic after layout is revealed
  useEffect(() => {
    if (showPreloader) return

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
  }, [location, showPreloader])

  return (
    <>
      {showPreloader && (
        <Preloader
          progress={progress}
          onComplete={() => setShowPreloader(false)}
        />
      )}
      
      <div 
        className="min-h-screen" 
        style={{ 
          background: 'var(--bg-base)', 
          color: 'var(--text-primary)', 
          transition: 'background-color 0.35s ease, color 0.35s ease',
          opacity: showPreloader ? 0 : 1,
          transform: showPreloader ? 'scale(0.98)' : 'scale(1)',
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.6s',
          transitionTimingFunction: 'ease-out'
        }}
      >
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero heroData={heroData} />
          <About aboutData={aboutData} />
          <Skills skillsData={skillsData} />
          <Projects projectsData={projectsData} />
          <Contact contactInfo={contactInfo} />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
