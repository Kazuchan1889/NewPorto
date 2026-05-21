import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'

export default function ContactSettings() {
  const [form, setForm] = useState({
    heading: '',
    description: '',
    email: '',
    location: '',
    phone: '',
    github: '',
    linkedin: '',
    twitter: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/contact-info')
      .then(res => res.json())
      .then(data => {
        setForm({
          heading: data.heading || '',
          description: data.description || '',
          email: data.email || '',
          location: data.location || '',
          phone: data.phone || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || ''
        })
        setLoading(false)
      })
      .catch(err => { console.error(err); setLoading(false) })
  }, [])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to save')
      alert('Contact settings updated!')
    } catch (err) {
      console.error(err)
      alert('Failed to update')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contact Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage the "Get in touch" / "Let's Work Together" section content and your personal contact info.
          </p>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2 px-6">
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="card p-6 rounded-2xl border-subtle space-y-4">
          <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Section Header</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Heading</label>
            <input name="heading" value={form.heading} onChange={handleChange} placeholder="Let's Work Together" className="input-field" />
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>The last word will automatically be highlighted with a gradient color.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Have a project in mind?..." className="input-field resize-none" />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="card p-6 rounded-2xl border-subtle space-y-4">
          <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Contact Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="hello@yourname.dev" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+62 812-3456-7890" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Jakarta, Indonesia" className="input-field" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6 rounded-2xl border-subtle space-y-4">
          <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Social Links</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>GitHub URL</label>
              <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/..." className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>LinkedIn URL</label>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Twitter / X URL</label>
              <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/..." className="input-field" />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
