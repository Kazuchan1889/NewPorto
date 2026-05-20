import { useEffect, useRef, useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle, Loader, Code2, Link, Share2 } from 'lucide-react'

// Contacts & Socials will be populated dynamically from state

export default function Contact({ contactInfo }) {
  const ref = useRef(null)
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done

  const contacts = [
    { icon: Mail,   label: 'Email',    value: contactInfo?.email || 'hello@yourname.dev',  href: contactInfo?.email ? `mailto:${contactInfo.email}` : null },
    { icon: MapPin, label: 'Location', value: contactInfo?.location || 'Jakarta, Indonesia',  href: null },
    { icon: Phone,  label: 'Phone',    value: contactInfo?.phone || '+62 812-3456-7890',   href: contactInfo?.phone ? `tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}` : null },
  ]

  const socials = [
    { icon: Code2,  label: 'GitHub',   href: contactInfo?.github || 'https://github.com' },
    { icon: Link,   label: 'LinkedIn', href: contactInfo?.linkedin || 'https://linkedin.com' },
    { icon: Share2, label: 'Twitter',  href: contactInfo?.twitter || 'https://twitter.com' },
  ]

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('done')
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error(err)
      setStatus('idle')
      alert('Failed to send message. Please try again.')
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(97,114,240,0.08) 0%, transparent 65%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="animate-on-scroll text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-500" />
            <span className="tag">Contact</span>
            <div className="h-px w-12 bg-gradient-to-r from-primary-500 to-transparent" />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {contactInfo?.heading ? (
              // Just split words and make the last one gradient for aesthetics
              <>
                {contactInfo.heading.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text">{contactInfo.heading.split(' ').slice(-1).join(' ')}</span>
              </>
            ) : (
              <>Let's <span className="gradient-text">Work Together</span></>
            )}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {contactInfo?.description || "Have a project in mind? Send me a message and let's discuss how I can help bring your vision to life."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left - info */}
          <div className="space-y-5 animate-on-scroll">
            {/* Contact info card */}
            <div className="card rounded-2xl p-7 border-subtle space-y-5">
              <h3 className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Contact Information</h3>
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                       style={{ background: 'rgba(97,114,240,0.10)', border: '1px solid rgba(97,114,240,0.20)' }}>
                    <Icon size={18} style={{ color: 'var(--primary-400)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-faint)' }}>{label}</p>
                    {href
                      ? <a href={href} className="font-medium transition-colors"
                           style={{ color: 'var(--text-primary)' }}
                           onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-300)')}
                           onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}>
                          {value}
                        </a>
                      : <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="card rounded-2xl p-5 border-subtle">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Connect with me on social media:</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                     className="flex-1 py-3 rounded-xl card border-subtle flex items-center justify-center gap-2 transition-all duration-300"
                     style={{ color: 'var(--text-muted)' }}
                     onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-400)'; e.currentTarget.style.borderColor = 'var(--border-brand)' }}
                     onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = '' }}>
                    <Icon size={16} />
                    <span className="text-xs font-medium hidden sm:block">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="card rounded-2xl p-5 flex items-center gap-4"
                 style={{ border: '1px solid rgba(34,197,94,0.25)' }}>
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full absolute inset-0 animate-ping opacity-60" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Currently Available</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Open to full-time & freelance</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="animate-on-scroll" style={{ transitionDelay: '0.15s' }}>
            <form onSubmit={handleSubmit} className="card rounded-2xl p-8 border-subtle space-y-5">
              <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Send a Message</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                         placeholder="John Doe" className="input-field" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                         placeholder="john@example.com" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange}
                       placeholder="Project Inquiry" className="input-field" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required
                          rows={5} placeholder="Tell me about your project..." className="input-field resize-none" />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'done'}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  status === 'done' ? 'bg-green-500 shadow-lg shadow-green-500/30'
                  : status === 'sending' ? 'opacity-70 cursor-not-allowed'
                  : 'btn-primary'
                }`}
                style={status === 'sending' ? { background: 'var(--primary-600)' } : undefined}
              >
                {status === 'sending' && <Loader size={17} className="animate-spin" />}
                {status === 'done'    && <CheckCircle size={17} />}
                {status === 'idle'    && <Send size={17} />}
                {status === 'idle'    && 'Send Message'}
                {status === 'sending' && 'Sending...'}
                {status === 'done'    && 'Message Sent!'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
