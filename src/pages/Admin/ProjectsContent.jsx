import { useState, useEffect, useRef } from 'react'
import { Save, Briefcase, Plus, Trash2, Link as LinkIcon, GitBranch, Image as ImageIcon, X, Tag } from 'lucide-react'

export default function ProjectsContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRefs = useRef({})
  
  const [formData, setFormData] = useState({
    heading: 'Featured Work',
    description: 'A selection of my recent projects. Some are built for clients, others are personal experiments.',
    projects: [
      {
        id: 1,
        title: 'Fintech Dashboard',
        category: 'Web App',
        description: 'A modern, high-performance financial dashboard built with Next.js and Tailwind CSS. Features real-time data visualization and secure authentication.',
        image: null,
        tags: ['React', 'Next.js', 'Tailwind', 'Chart.js'],
        link: 'https://example.com',
        github: 'https://github.com'
      },
      {
        id: 2,
        title: 'E-Commerce Platform',
        category: 'Full Stack',
        description: 'Scalable e-commerce solution with headless CMS, Stripe integration, and complex state management using Redux.',
        image: null,
        tags: ['Node.js', 'React', 'Stripe', 'MongoDB'],
        link: 'https://example.com',
        github: ''
      }
    ]
  })

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData(prev => ({
            ...prev,
            heading: data.heading || prev.heading,
            description: data.description || prev.description,
            projects: data.projects && data.projects.length > 0 ? data.projects : prev.projects
          }))
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  // Basic Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Project Handlers
  const handleProjectChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }))
  }

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        {
          id: Date.now(),
          title: '',
          category: '',
          description: '',
          image: null,
          tags: [],
          link: '',
          github: ''
        },
        ...prev.projects
      ]
    }))
  }

  const removeProject = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  // Project Image Handlers
  const handleImageChange = (id, e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        handleProjectChange(id, 'image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (id) => {
    handleProjectChange(id, 'image', null)
    if (fileInputRefs.current[id]) fileInputRefs.current[id].value = ''
  }

  // Project Tags Handlers
  const addTag = (id, e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = e.target.value.trim()
      if (!newTag) return
      
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.map(p => {
          if (p.id === id && !p.tags.includes(newTag)) {
            return { ...p, tags: [...p.tags, newTag] }
          }
          return p
        })
      }))
      e.target.value = ''
    }
  }

  const removeTag = (id, tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === id) {
          return { ...p, tags: p.tags.filter(t => t !== tagToRemove) }
        }
        return p
      })
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save projects')
    } catch (error) {
      console.error(error)
      alert('Error saving projects: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative pb-20">
      
      {/* Header & Intro */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Header & Intro</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Section Title
            </label>
            <input 
              name="heading" 
              value={formData.heading} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Sub-description
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={2}
              className="input-field resize-none" 
            />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Projects Management</h2>
          <button 
            onClick={addProject}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus size={16} /> Add New Project
          </button>
        </div>

        {formData.projects.map((project, index) => (
          <div key={project.id} className="card rounded-2xl p-6 border-subtle relative group transition-colors hover:border-brand">
            
            <button 
              onClick={() => removeProject(project.id)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              title="Delete Project"
            >
              <Trash2 size={14} />
            </button>
            
            <div className="text-xs font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
              PROJECT {index + 1}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left: Thumbnail Uploader */}
              <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Thumbnail Image
                </label>
                <div 
                  className="w-full aspect-[4/3] rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-colors"
                  style={{ borderColor: project.image ? 'transparent' : 'var(--border-brand)', background: 'var(--bg-elevated)' }}
                >
                  {project.image ? (
                    <>
                      <img src={project.image} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(project.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4" style={{ color: 'var(--text-muted)' }}>
                      <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                      <span className="text-xs font-medium block mb-3">No Thumbnail</span>
                      <label 
                        htmlFor={`upload-${project.id}`}
                        className="btn-outline inline-block px-4 py-1.5 text-xs cursor-pointer"
                      >
                        Browse
                      </label>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id={`upload-${project.id}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(project.id, e)}
                    ref={(el) => (fileInputRefs.current[project.id] = el)}
                  />
                </div>
              </div>

              {/* Right: Info Fields */}
              <div className="flex-1 space-y-4 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Project Title</label>
                    <input 
                      value={project.title} 
                      onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                      className="input-field py-2 text-sm" 
                      placeholder="e.g. E-Commerce Platform"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Category / Badge</label>
                    <input 
                      value={project.category} 
                      onChange={(e) => handleProjectChange(project.id, 'category', e.target.value)}
                      className="input-field py-2 text-sm" 
                      placeholder="e.g. Web App"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Description</label>
                  <textarea 
                    value={project.description} 
                    onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                    rows={3}
                    className="input-field py-2 text-sm resize-none" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Live URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <LinkIcon size={14} />
                      </div>
                      <input 
                        value={project.link} 
                        onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                        className="input-field py-2 text-sm" 
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>GitHub Repository URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <GitBranch size={14} />
                      </div>
                      <input 
                        value={project.github} 
                        onChange={(e) => handleProjectChange(project.id, 'github', e.target.value)}
                        className="input-field py-2 text-sm" 
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Tags (Press Enter to add)</label>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Tag size={14} />
                      </div>
                      <input 
                        onKeyDown={(e) => addTag(project.id, e)}
                        className="input-field py-2 text-sm" 
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Type a tag and press Enter..."
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="tag flex items-center gap-1.5 pr-1 py-1 text-xs bg-black/5 dark:bg-white/5 border border-subtle">
                          {tag}
                          <button 
                            onClick={() => removeTag(project.id, tag)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
        {formData.projects.length === 0 && (
          <div className="text-center py-12 rounded-2xl border-2 border-dashed border-subtle">
            <Briefcase size={32} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--text-muted)' }}>No projects found. Create your first project!</p>
          </div>
        )}
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-xl transition-all duration-300 ${
            isSaving 
              ? 'bg-green-500 shadow-green-500/20' 
              : 'bg-primary-500 hover:bg-primary-600 hover:-translate-y-1 shadow-primary-500/30 hover:shadow-primary-500/50'
          }`}
        >
          <Save size={18} className={isSaving ? 'animate-bounce' : ''} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

    </div>
  )
}
