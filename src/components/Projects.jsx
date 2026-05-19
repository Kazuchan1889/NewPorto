import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Code2, Star, GitFork } from 'lucide-react'

// Fallbacks
const defaultProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with real-time inventory, payment gateway integration, and admin dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'Web App',
    stars: 128, forks: 34,
    link: '#', github: '#',
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, drag-and-drop boards, and team analytics.',
    tags: ['Next.js', 'Socket.io', 'MongoDB', 'Tailwind'],
    category: 'Web App',
    stars: 89, forks: 21,
    link: '#', github: '#',
  },
  {
    id: 3,
    title: 'Finance Dashboard',
    description: 'Interactive financial analytics dashboard with charts, portfolio tracking, and AI-powered insights.',
    tags: ['React', 'D3.js', 'Express', 'REST API'],
    category: 'API',
    stars: 203, forks: 58,
    link: '#', github: '#',
  },
]

const projectGradients = [
  { gradient: 'from-primary-600 to-primary-400', accent: 'from-blue-500 to-purple-500' },
  { gradient: 'from-violet-600 to-purple-400', accent: 'from-violet-500 to-pink-500' },
  { gradient: 'from-emerald-600 to-teal-400', accent: 'from-emerald-500 to-cyan-500' },
  { gradient: 'from-rose-600 to-pink-400', accent: 'from-rose-500 to-orange-500' },
  { gradient: 'from-amber-600 to-yellow-400', accent: 'from-amber-500 to-orange-500' },
  { gradient: 'from-cyan-600 to-blue-400', accent: 'from-cyan-500 to-primary-500' }
]

function ProjectCard({ project, index }) {
  const visual = projectGradients[index % projectGradients.length]
  return (
    <div
      className="animate-on-scroll card rounded-2xl overflow-hidden border-subtle group hover:border-brand transition-all duration-500 hover:-translate-y-2"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {/* Thumbnail */}
      <div className="h-44 relative overflow-hidden bg-black/5 dark:bg-white/5">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${visual.gradient} relative`}>
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${visual.accent} opacity-30 blur-xl`} />
            <div className={`absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${visual.accent} opacity-20 blur-xl`} />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-sm">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold hover:bg-white/30 transition">
              <ExternalLink size={14} /> Live
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold hover:bg-white/30 transition">
              <Code2 size={14} /> Code
            </a>
          )}
        </div>

        {project.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-white border border-white/20">
              {project.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags && project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {project.stars !== undefined && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>
              <Star size={12} className="text-yellow-500" /> {project.stars}
            </span>
          )}
          {project.forks !== undefined && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-faint)' }}>
              <Star size={12} style={{ color: 'var(--primary-400)' }} /> {project.forks}
            </span>
          )}
          <div className="ml-auto flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'var(--text-faint)' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-400)')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}>
                <Code2 size={15} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'var(--text-faint)' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-400)')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const [projectsData, setProjectsData] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjectsData(data))
      .catch(err => console.error(err))
  }, [])

  const list = projectsData?.projects?.length > 0 ? projectsData.projects : defaultProjects
  const filters = ['All', ...new Set(list.map(p => p.category).filter(Boolean))]

  const filtered = activeFilter === 'All'
    ? list
    : list.filter((p) => p.category === activeFilter)

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
  }, [filtered])

  return (
    <section id="projects" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent, rgba(97,114,240,0.04), transparent)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-500" />
            <span className="tag">Projects</span>
            <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-transparent" />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {projectsData?.heading ? (
              <>
                {projectsData.heading.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text">{projectsData.heading.split(' ').slice(-1)[0]}</span>
              </>
            ) : (
              <>
                Featured <span className="gradient-text">Work</span>
              </>
            )}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {projectsData?.description || 'A curated selection of projects that showcase my skills and passion for building remarkable products.'}
          </p>
        </div>

        {/* Filters */}
        <div className="animate-on-scroll flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeFilter === f ? 'text-white shadow-lg shadow-primary-500/30' : 'card border-subtle'
              }`}
              style={
                activeFilter === f
                  ? { background: 'linear-gradient(135deg, #6172f0, #4f52e5)' }
                  : { color: 'var(--text-muted)' }
              }
              onMouseEnter={(e) => { if (activeFilter !== f) e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { if (activeFilter !== f) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="animate-on-scroll text-center mt-12">
          <a href="https://github.com" target="_blank" rel="noreferrer"
             className="btn-outline inline-flex items-center gap-2">
            <Code2 size={17} />
            View All on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
