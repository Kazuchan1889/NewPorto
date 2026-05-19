import { useState, useRef, useEffect } from 'react'
import { Save, AlertCircle, Sparkles, Upload, X, Image as ImageIcon } from 'lucide-react'

export default function HeroContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    firstName: 'Your',
    lastName: 'Name',
    title: 'Full Stack Developer',
    description: "I craft beautiful, high-performance web applications that blend stunning design with clean, scalable code. Let's build something extraordinary together.",
    freelanceBadge: 'Available for freelance work',
    statusBadge: 'Open to work 🚀',
    avatar: null,
    stats: [
      { id: 1, label: 'Years Exp.', value: '3+' },
      { id: 2, label: 'Projects', value: '20+' },
      { id: 3, label: 'Clients', value: '15+' }
    ]
  })

  useEffect(() => {
    fetch('/api/hero')
      .then(res => res.json())
      .then(data => {
        if (data) {
          const parts = (data.name || '').split(' ');
          const fName = data.name ? parts[0] : 'Your';
          const lName = data.name ? parts.slice(1).join(' ') : 'Name';
          setFormData(prev => ({
            ...prev,
            firstName: fName,
            lastName: lName,
            title: data.title || prev.title,
            description: data.description || prev.description,
            freelanceBadge: data.freelance || prev.freelanceBadge,
            statusBadge: data.statusBadge || prev.statusBadge,
            avatar: data.avatarUrl || null,
            stats: data.stats && data.stats.length > 0
              ? data.stats.map(s => ({ id: s.id, label: s.label, value: s.value }))
              : prev.stats
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

  const handleStatChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, avatar: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        title: formData.title,
        description: formData.description,
        freelance: formData.freelanceBadge,
        statusBadge: formData.statusBadge,
        avatarUrl: formData.avatar,
        stats: formData.stats
      }
      
      const res = await fetch('/api/hero', {
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
      
      {/* Profile Photo / Avatar */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Avatar Photo</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar Preview */}
          <div className="relative w-40 h-40 rounded-full border-2 border-dashed flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300" 
               style={{ borderColor: formData.avatar ? 'transparent' : 'var(--border-brand)', background: 'var(--bg-elevated)' }}>
            {formData.avatar ? (
              <>
                <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                <Upload size={24} className="mx-auto mb-2 opacity-50" />
                <span className="text-xs font-medium">No Image</span>
              </div>
            )}
          </div>
          
          {/* Upload Controls */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Profile Picture</h3>
            <p className="text-sm leading-relaxed max-w-sm mx-auto sm:mx-0" style={{ color: 'var(--text-muted)' }}>
              Recommended size: 500x500px. Supports PNG, JPG, or WebP. Transparent backgrounds look best on dark mode.
            </p>
            <div className="pt-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden" 
                id="avatar-upload"
              />
              <label 
                htmlFor="avatar-upload"
                className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
              >
                <Upload size={16} />
                Choose File
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Main Identity</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              First Name
            </label>
            <input 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Last Name (Highlighted)
            </label>
            <input 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Professional Title
            </label>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Short Bio / Description
            </label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4}
              className="input-field resize-none leading-relaxed" 
            />
          </div>
        </div>
      </div>

      {/* Badges & Status */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={18} className="text-accent-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Badges & Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Top Badge Text
            </label>
            <input 
              name="freelanceBadge" 
              value={formData.freelanceBadge} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Avatar Status Indicator
            </label>
            <input 
              name="statusBadge" 
              value={formData.statusBadge} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Highlights & Stats</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          These 3 stats appear floating around your avatar in the hero section.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formData.stats.map((stat, i) => (
            <div key={stat.id} className="p-4 rounded-xl border border-subtle bg-black/5 dark:bg-white/5 space-y-4">
              <div className="text-xs font-bold text-center" style={{ color: 'var(--text-muted)' }}>STAT {i + 1}</div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Value</label>
                <input 
                  value={stat.value} 
                  onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                  className="input-field py-2" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Label</label>
                <input 
                  value={stat.label} 
                  onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                  className="input-field py-2 text-sm" 
                />
              </div>
            </div>
          ))}
        </div>
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
