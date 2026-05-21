import { useState, useEffect, useRef } from 'react'
import { Code2, Rocket, Users, Coffee } from 'lucide-react'

// Fallback data
const defaultHighlights = [
  { icon: Code2,   title: 'Clean Code',     description: 'Readable, maintainable, scalable architecture' },
  { icon: Rocket,  title: 'Fast Delivery',  description: 'Efficient workflows with on-time results' },
  { icon: Users,   title: 'Team Player',    description: 'Collaborative, communicative, agile mindset' },
  { icon: Coffee,  title: 'Detail Focused', description: 'Pixel-perfect UI and polished experience' },
]

const defaultTimeline = [
  { year: '2024', title: 'Senior Frontend Developer', company: 'TechCorp' },
  { year: '2023', title: 'Full Stack Developer',       company: 'StartupXYZ' },
  { year: '2022', title: 'Junior Developer',           company: 'Agency ABC' },
  { year: '2021', title: 'CS Degree Graduated',        company: 'State University' },
]

export default function About({ aboutData }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    )
    
    // Wait for render before observing
    setTimeout(() => {
      ref.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    }, 100)
    
    return () => observer.disconnect()
  }, [aboutData])

  return (
    <section id="about" ref={ref} className="py-28 relative overflow-hidden">
      {/* Subtle bg tint */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(135deg, rgba(97,114,240,0.04) 0%, transparent 60%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Label */}
        <div className="animate-on-scroll flex items-center gap-4 mb-4">
          <div className="h-px w-14 bg-gradient-to-r from-primary-500 to-transparent" />
          <span className="tag">About Me</span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left – text */}
          <div className="space-y-6">
            <h2 className="animate-on-scroll section-title" style={{ color: 'var(--text-primary)' }}>
              {aboutData?.heading ? aboutData.heading.split(' ').slice(0, -2).join(' ') : 'Passionate about building'}{' '}
              <span className="gradient-text">
                {aboutData?.heading ? aboutData.heading.split(' ').slice(-2).join(' ') : 'digital experiences'}
              </span>
            </h2>

            <div className="animate-on-scroll space-y-4 text-lg leading-relaxed"
                 style={{ color: 'var(--text-muted)', transitionDelay: '0.1s' }}>
              <p>
                {aboutData?.bio1 || "I'm a Full Stack Developer with 3+ years of experience turning ideas into elegant, high-performance web applications. I specialize in React, Node.js, and modern cloud architecture."}
              </p>
              {aboutData?.bio2 && (
                <p>{aboutData.bio2}</p>
              )}
              {(!aboutData && (
                <p>
                  My passion lies at the intersection of great design and clean engineering—I believe software should
                  be both beautiful and reliable.
                </p>
              ))}
              {aboutData?.bio3 && (
                <p>{aboutData.bio3}</p>
              )}
              {(!aboutData && (
                <p>
                  When I'm not coding, you'll find me exploring the latest in tech, contributing to open source,
                  or brainstorming the next big idea over a strong cup of coffee ☕.
                </p>
              ))}
            </div>

            <div className="animate-on-scroll flex gap-4 pt-2" style={{ transitionDelay: '0.2s' }}>
              <a href={aboutData?.resumeUrl || '/resume.pdf'} target="_blank" rel="noreferrer" download="My_Resume.pdf" className="btn-primary text-sm">Download CV</a>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline text-sm"
              >
                Contact Me
              </button>
            </div>
          </div>

          {/* Right – highlight cards */}
          <div className="grid grid-cols-2 gap-4">
            {(aboutData?.highlights?.length > 0 ? aboutData.highlights : defaultHighlights).map((item, i) => {
              const icons = [Code2, Rocket, Users, Coffee]
              const Icon = item.icon || icons[i % icons.length]
              return (
                <div
                  key={item.title || item.id}
                  className="animate-on-scroll card glass-hover rounded-2xl p-6 border-subtle"
                  style={{ transitionDelay: `${0.1 * i}s` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                       style={{ background: 'rgba(97,114,240,0.12)', border: '1px solid rgba(97,114,240,0.22)' }}>
                    <Icon size={22} style={{ color: 'var(--primary-400)' }} />
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="animate-on-scroll mt-20" style={{ transitionDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--text-primary)' }}>
            My Journey
          </h3>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                 style={{ background: 'linear-gradient(to bottom, rgba(97,114,240,0.5), transparent)' }} />
            {(aboutData?.timeline?.length > 0 ? aboutData.timeline : defaultTimeline).map((item, i) => {
              const side = i % 2 === 0 ? 'left' : 'right'
              return (
                <div key={item.id || item.year} className={`flex items-center gap-6 mb-8 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                    <div className={`card rounded-xl p-4 border-subtle inline-block hover:border-brand transition-all duration-300 text-left ${side === 'left' ? 'md:mr-8' : 'md:ml-8'}`}>
                      <p className="font-mono text-sm mb-1" style={{ color: 'var(--primary-400)' }}>{item.year}</p>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title || item.role}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.company}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-primary-500 border-2 flex-shrink-0 glow"
                       style={{ borderColor: 'var(--bg-base)' }} />
                  <div className="flex-1" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
