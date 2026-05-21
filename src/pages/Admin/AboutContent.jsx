import { useState, useEffect } from 'react'
import { Save, User, Star, Map, Plus, Trash2, FileText } from 'lucide-react'

export default function AboutContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    heading: 'Passionate about building digital experiences',
    bio1: "I'm a Full Stack Developer with 3+ years of experience turning ideas into elegant, high-performance web applications. I specialize in React, Node.js, and modern cloud architecture.",
    bio2: "My passion lies at the intersection of great design and clean engineering—I believe software should be both beautiful and reliable.",
    bio3: "When I'm not coding, you'll find me exploring the latest in tech, contributing to open source, or brainstorming the next big idea over a strong cup of coffee ☕.",
    resumeUrl: '/resume.pdf',
    highlights: [
      { id: 1, label: 'Clean Code', desc: 'Readable, maintainable, scalable architecture' },
      { id: 2, label: 'Fast Delivery', desc: 'Efficient workflows with on-time results' },
      { id: 3, label: 'Team Player', desc: 'Collaborative, communicative, agile mindset' },
      { id: 4, label: 'Detail Focused', desc: 'Pixel-perfect UI and polished experience' },
    ],
    timeline: [
      { id: 1, year: '2024', title: 'Senior Frontend Developer', company: 'TechCorp' },
      { id: 2, year: '2023', title: 'Full Stack Developer', company: 'StartupXYZ' },
      { id: 3, year: '2022', title: 'Junior Developer', company: 'Agency ABC' },
      { id: 4, year: '2021', title: 'CS Degree Graduated', company: 'State University' },
    ]
  })

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data && (data.heading || data.bio1 || data.highlights?.length > 0)) {
          setFormData(prev => ({
            heading: data.heading || '',
            bio1: data.bio1 || '',
            bio2: data.bio2 || '',
            bio3: data.bio3 || '',
            resumeUrl: data.resumeUrl || '',
            highlights: data.highlights && data.highlights.length > 0 ? data.highlights.map(h => ({ id: h.id, label: h.title, desc: h.description })) : prev.highlights,
            timeline: data.timeline && data.timeline.length > 0 ? data.timeline : prev.timeline
          }))
        }
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Please upload a valid PDF file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please upload a PDF smaller than 5MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, resumeUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHighlightChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map(h => h.id === id ? { ...h, [field]: value } : h)
    }))
  }

  const handleTimelineChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map(t => t.id === id ? { ...t, [field]: value } : t)
    }))
  }

  const addTimelineEvent = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        { id: Date.now(), year: '', title: '', company: '' },
        ...prev.timeline
      ]
    }))
  }

  const removeTimelineEvent = (id) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter(t => t.id !== id)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        highlights: formData.highlights.map(h => ({ title: h.label, description: h.desc }))
      }
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) throw new Error('Failed to save data')
    } catch (error) {
      console.error(error)
      alert('Error saving data: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative pb-20">
      
      {/* Introduction & Bio */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <User size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Introduction & Bio</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Main Heading
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
              Biography Paragraph 1
            </label>
            <textarea 
              name="bio1" 
              value={formData.bio1} 
              onChange={handleChange} 
              rows={3}
              className="input-field resize-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Biography Paragraph 2
            </label>
            <textarea 
              name="bio2" 
              value={formData.bio2} 
              onChange={handleChange} 
              rows={2}
              className="input-field resize-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Biography Paragraph 3
            </label>
            <textarea 
              name="bio3" 
              value={formData.bio3} 
              onChange={handleChange} 
              rows={3}
              className="input-field resize-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Resume / CV File (PDF)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="file"
                id="resume-upload"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="resume-upload"
                className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
              >
                <FileText size={16} />
                Upload PDF
              </label>
              {formData.resumeUrl && formData.resumeUrl.length > 0 && (
                <span className="text-sm text-green-500 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  CV Attached
                </span>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>
              Max size: 5MB. This file will be available for download on your public page.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Star size={18} className="text-accent-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Feature Highlights</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          These are the 4 cards displaying your key traits in the About section.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.highlights.map((highlight, index) => (
            <div key={highlight.id} className="p-4 rounded-xl border border-subtle bg-black/5 dark:bg-white/5 space-y-3">
              <div className="text-xs font-bold text-center mb-2" style={{ color: 'var(--text-muted)' }}>CARD {index + 1}</div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Title</label>
                <input 
                  value={highlight.label} 
                  onChange={(e) => handleHighlightChange(highlight.id, 'label', e.target.value)}
                  className="input-field py-2 text-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Description</label>
                <textarea 
                  value={highlight.desc} 
                  onChange={(e) => handleHighlightChange(highlight.id, 'desc', e.target.value)}
                  rows={2}
                  className="input-field py-2 text-sm resize-none" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline (My Journey) */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-emerald-500" />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>My Journey (Timeline)</h2>
          </div>
          <button 
            onClick={addTimelineEvent}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors"
          >
            <Plus size={14} /> Add Event
          </button>
        </div>

        <div className="space-y-4">
          {formData.timeline.map((event) => (
            <div key={event.id} className="flex gap-4 items-start p-4 rounded-xl border border-subtle bg-black/5 dark:bg-white/5 relative group transition-colors hover:border-brand">
              <button 
                onClick={() => removeTimelineEvent(event.id)}
                className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Remove Event"
              >
                <Trash2 size={12} />
              </button>
              
              <div className="w-24 flex-shrink-0">
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Year</label>
                <input 
                  value={event.year} 
                  onChange={(e) => handleTimelineChange(event.id, 'year', e.target.value)}
                  className="input-field py-2 text-sm text-center" 
                  placeholder="202X"
                />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Role / Title</label>
                  <input 
                    value={event.title} 
                    onChange={(e) => handleTimelineChange(event.id, 'title', e.target.value)}
                    className="input-field py-2 text-sm" 
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Company / Institute</label>
                  <input 
                    value={event.company} 
                    onChange={(e) => handleTimelineChange(event.id, 'company', e.target.value)}
                    className="input-field py-2 text-sm" 
                    placeholder="e.g. TechCorp Inc."
                  />
                </div>
              </div>
            </div>
          ))}
          {formData.timeline.length === 0 && (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              No timeline events yet. Click "Add Event" to create one.
            </div>
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
