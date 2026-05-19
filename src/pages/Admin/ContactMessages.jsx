import { useState, useEffect } from 'react'
import { Mail, Trash2, CheckCircle } from 'lucide-react'

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = () => {
    setLoading(true)
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id) => {
    await fetch(`/api/messages/${id}/read`, { method: 'PATCH' })
    fetchMessages()
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    fetchMessages()
  }

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contact Messages</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {messages.length} message{messages.length !== 1 ? 's' : ''} &mdash; {messages.filter(m => !m.isRead).length} unread
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="card rounded-2xl border-subtle p-16 text-center">
          <Mail size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>No messages yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card rounded-2xl p-6 border transition-all duration-200 ${msg.isRead ? 'border-subtle opacity-75' : 'border-brand'}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{msg.name}</span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-500/15" style={{ color: 'var(--primary-400)' }}>New</span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(msg.createdAt)}</span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm" style={{ color: 'var(--primary-400)' }}>{msg.email}</a>
                  {msg.subject && (
                    <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-secondary)' }}>{msg.subject}</p>
                  )}
                  <p className="text-sm mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!msg.isRead && (
                    <button
                      onClick={() => markRead(msg.id)}
                      title="Mark as read"
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(97,114,240,0.12)', color: 'var(--primary-400)' }}
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMsg(msg.id)}
                    title="Delete message"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
