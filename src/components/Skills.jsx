import { useState, useEffect, useRef } from 'react'

// Fallbacks
const defaultCategories = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React.js',       level: 92 },
      { name: 'Next.js',        level: 85 },
      { name: 'TypeScript',     level: 80 },
      { name: 'Tailwind CSS',   level: 95 },
      { name: 'Framer Motion',  level: 72 },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js',        level: 88 },
      { name: 'Express.js',     level: 85 },
      { name: 'PostgreSQL',     level: 78 },
      { name: 'MongoDB',        level: 74 },
      { name: 'REST API',       level: 90 },
    ],
  },
  {
    label: 'Tools & DevOps',
    skills: [
      { name: 'Git & GitHub',   level: 93 },
      { name: 'Docker',         level: 68 },
      { name: 'Linux / CLI',    level: 75 },
      { name: 'Vercel / Netlify', level: 88 },
      { name: 'Figma',          level: 72 },
    ],
  },
]

const defaultTechBadges = [
  'React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'PostgreSQL', 'MongoDB', 'Prisma', 'Docker', 'Git', 'Tailwind', 'REST API',
  'GraphQL', 'Vite', 'Redux', 'Figma',
]

function SkillBar({ name, level, barColor, delay }) {
  const barRef  = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && fillRef.current) {
          fillRef.current.style.width = `${level}%`
        }
      },
      { threshold: 0.3 }
    )
    if (barRef.current) observer.observe(barRef.current)
    return () => observer.disconnect()
  }, [level])

  return (
    <div ref={barRef} className="group">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
          {name}
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{level}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div
          ref={fillRef}
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: 0, background: barColor, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  )
}

export default function Skills({ skillsData }) {
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
  }, [skillsData])

  return (
    <section id="skills" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(to right, transparent, rgba(97,114,240,0.04), transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-500" />
            <span className="tag">Skills</span>
            <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-transparent" />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {skillsData?.heading ? (
              <>
                {skillsData.heading.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text">{skillsData.heading.split(' ').slice(-1)[0]}</span>
              </>
            ) : (
              <>
                My <span className="gradient-text">Technical</span> Arsenal
              </>
            )}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {skillsData?.description || 'A blend of frontend finesse and backend power — constantly expanding with modern tools and best practices.'}
          </p>
        </div>

        {/* Skill cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {(skillsData?.categories?.length > 0 ? skillsData.categories : defaultCategories).map((cat, ci) => {
            const colors = [
              { color: 'from-primary-500 to-primary-400', barColor: '#6172f0' },
              { color: 'from-accent-500 to-accent-400', barColor: '#f97316' },
              { color: 'from-emerald-500 to-teal-400', barColor: '#10b981' }
            ]
            const activeColor = colors[ci % colors.length]
            return (
              <div
                key={cat.label}
                className="animate-on-scroll card glass-hover rounded-2xl p-6 border-subtle"
                style={{ transitionDelay: `${ci * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${activeColor.color}`} />
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{cat.label}</h3>
                </div>
                <div className="space-y-5">
                  {cat.skills && cat.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      barColor={activeColor.barColor}
                      delay={si * 100 + ci * 150}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tech badges */}
        <div className="animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
          <p className="text-center text-sm mb-6 font-mono" style={{ color: 'var(--text-faint)' }}>
            // Technologies I've worked with
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {(skillsData?.techBadges?.length > 0 ? skillsData.techBadges : defaultTechBadges).map((tech, i) => (
              <span
                key={tech}
                className="tag cursor-default hover:scale-105 transition-all duration-300"
                style={{ transitionDelay: `${i * 25}ms` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
