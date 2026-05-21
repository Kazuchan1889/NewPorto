import { useState, useEffect } from 'react'
import { Save, Code2, Layers, Tag, Plus, Trash2, X } from 'lucide-react'

export default function SkillsContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newBadge, setNewBadge] = useState('')
  
  const [formData, setFormData] = useState({
    heading: 'My Technical Arsenal',
    description: 'A blend of frontend finesse and backend power — constantly expanding with modern tools and best practices.',
    categories: [
      {
        id: 1, 
        label: 'Frontend',
        colorClass: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
        skills: [
          { id: 11, name: 'React.js', level: 92 },
          { id: 12, name: 'Next.js', level: 85 },
          { id: 13, name: 'TypeScript', level: 80 },
          { id: 14, name: 'Tailwind CSS', level: 95 },
        ]
      },
      {
        id: 2, 
        label: 'Backend',
        colorClass: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
        skills: [
          { id: 21, name: 'Node.js', level: 88 },
          { id: 22, name: 'PostgreSQL', level: 78 },
          { id: 23, name: 'REST API', level: 90 },
        ]
      },
      {
        id: 3, 
        label: 'Tools & DevOps',
        colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        skills: [
          { id: 31, name: 'Git & GitHub', level: 93 },
          { id: 32, name: 'Docker', level: 68 },
          { id: 33, name: 'Vercel / Netlify', level: 88 },
        ]
      },
    ],
    techBadges: [
      'React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
      'PostgreSQL', 'MongoDB', 'Prisma', 'Docker', 'Git', 'Tailwind', 'REST API',
      'Vite', 'Figma'
    ]
  })

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData(prev => ({
            ...prev,
            heading: data.heading || prev.heading,
            description: data.description || prev.description,
            categories: data.categories && data.categories.length > 0 ? data.categories : prev.categories,
            techBadges: data.techBadges && data.techBadges.length > 0 ? data.techBadges : prev.techBadges
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

  // Category & Skills Handlers
  const handleCategoryNameChange = (catId, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => cat.id === catId ? { ...cat, label: value } : cat)
    }))
  }

  const handleSkillChange = (catId, skillId, field, value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id !== catId) return cat
        return {
          ...cat,
          skills: cat.skills.map(s => s.id === skillId ? { ...s, [field]: value } : s)
        }
      })
    }))
  }

  const addSkill = (catId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id !== catId) return cat
        return {
          ...cat,
          skills: [...cat.skills, { id: Date.now(), name: '', level: 50 }]
        }
      })
    }))
  }

  const removeSkill = (catId, skillId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id !== catId) return cat
        return {
          ...cat,
          skills: cat.skills.filter(s => s.id !== skillId)
        }
      })
    }))
  }

  // Badges Handlers
  const addBadge = (e) => {
    e.preventDefault()
    if (!newBadge.trim()) return
    if (!formData.techBadges.includes(newBadge.trim())) {
      setFormData(prev => ({ ...prev, techBadges: [...prev.techBadges, newBadge.trim()] }))
    }
    setNewBadge('')
  }

  const removeBadge = (badgeToRemove) => {
    setFormData(prev => ({
      ...prev,
      techBadges: prev.techBadges.filter(b => b !== badgeToRemove)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save skills')
    } catch (error) {
      console.error(error)
      alert('Error saving skills: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative pb-20">
      
      {/* Header & Intro */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Code2 size={18} className="text-primary-500" />
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

      {/* Progress Bars (Categories) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Layers size={18} className="text-accent-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Skill Categories (Progress Bars)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.categories.map((cat) => (
            <div key={cat.id} className="card rounded-2xl p-5 border-subtle flex flex-col space-y-5">
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold ${cat.colorClass}`}>
                  {cat.label.charAt(0)}
                </div>
                <input
                  value={cat.label}
                  onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                  className="bg-transparent border-b border-transparent focus:border-brand outline-none font-bold text-lg flex-1 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div className="flex-1 space-y-3">
                {cat.skills.map((skill) => (
                  <div key={skill.id} className="group relative flex items-center gap-3 p-3 rounded-xl border border-subtle bg-black/5 dark:bg-white/5 transition-colors hover:border-brand">
                    <button 
                      onClick={() => removeSkill(cat.id, skill.id)}
                      className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      title="Remove Skill"
                    >
                      <Trash2 size={10} />
                    </button>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex gap-2">
                        <input
                          value={skill.name}
                          onChange={(e) => handleSkillChange(cat.id, skill.id, 'name', e.target.value)}
                          className="bg-transparent border-b border-transparent focus:border-brand outline-none text-sm font-semibold flex-1 min-w-0"
                          style={{ color: 'var(--text-primary)' }}
                          placeholder="Skill Name"
                        />
                        <div className="flex items-center gap-1 w-16 flex-shrink-0">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleSkillChange(cat.id, skill.id, 'level', parseInt(e.target.value) || 0)}
                            className="bg-transparent border-b border-transparent focus:border-brand outline-none text-xs text-right font-mono w-full"
                            style={{ color: 'var(--text-secondary)' }}
                          />
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>%</span>
                        </div>
                      </div>
                      
                      {/* Visual bar editor */}
                      <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${cat.colorClass.split(' ')[0].replace('/10', '')}`} 
                          style={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addSkill(cat.id)}
                className="w-full py-2.5 rounded-xl border border-dashed border-subtle hover:border-brand hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold flex items-center justify-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Badges Cloud */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={18} className="text-blue-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Tech Badges Cloud</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          Add random technologies, tools, or libraries you are familiar with to create a text cloud effect at the bottom of the section.
        </p>

        <form onSubmit={addBadge} className="flex gap-3 mb-6">
          <input 
            value={newBadge}
            onChange={(e) => setNewBadge(e.target.value)}
            placeholder="Type a technology (e.g. React Native) and press Enter"
            className="input-field flex-1"
          />
          <button type="submit" disabled={!newBadge.trim()} className="btn-primary py-0 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-subtle bg-black/5 dark:bg-white/5 min-h-[100px]">
          {formData.techBadges.map(badge => (
            <span key={badge} className="tag flex items-center gap-1.5 pr-1.5 py-1 text-sm bg-white dark:bg-dark-700">
              {badge}
              <button 
                onClick={() => removeBadge(badge)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors text-gray-400"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          {formData.techBadges.length === 0 && (
            <span className="text-sm italic" style={{ color: 'var(--text-faint)' }}>No badges added yet.</span>
          )}
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
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
