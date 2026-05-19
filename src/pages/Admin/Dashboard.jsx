import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, MousePointerClick, MessageSquare, TrendingUp } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useEffect, useState } from 'react'

const trafficData = [
  { name: 'Mon', views: 400, clicks: 240 },
  { name: 'Tue', views: 300, clicks: 139 },
  { name: 'Wed', views: 520, clicks: 380 },
  { name: 'Thu', views: 450, clicks: 290 },
  { name: 'Fri', views: 600, clicks: 480 },
  { name: 'Sat', views: 800, clicks: 520 },
  { name: 'Sun', views: 750, clicks: 490 },
]


export default function AdminDashboard() {
  const { isDark } = useTheme()
  const gridColor = isDark ? '#ffffff15' : '#6172f020'
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(err => console.error('Dashboard messages fetch error:', err))
  }, [])

  const unreadCount = messages.filter(m => !m.isRead).length
  const recentMessages = messages.slice(0, 3)

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  const stats = [
    { label: 'Total Views', value: '—', trend: '—', icon: Eye },
    { label: 'Link Clicks', value: '—', trend: '—', icon: MousePointerClick },
    { label: 'New Messages', value: String(unreadCount || messages.length), trend: `+${messages.length} total`, icon: MessageSquare },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="card p-6 rounded-2xl border-subtle">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <Icon size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 card p-6 rounded-2xl border-subtle">
          <div className="mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Traffic Overview</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Portfolio visits over the last 7 days</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6172f0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6172f0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6172f0" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card p-6 rounded-2xl border-subtle flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Inbox</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Recent inquiries ({messages.length} total)</p>
          </div>
          <div className="flex-1 space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-faint)' }}>No messages yet</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className={`p-4 rounded-xl border transition-colors cursor-pointer ${msg.isRead ? 'border-subtle' : 'border-brand bg-primary-500/5'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{msg.name}</h4>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs font-medium mb-1 truncate" style={{ color: 'var(--primary-400)' }}>{msg.subject || '(no subject)'}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{msg.email}</p>
                </div>
              ))
            )}
          </div>
          <a href="/admin/contact" className="w-full mt-4 py-2.5 rounded-xl border-subtle border text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-center block" style={{ color: 'var(--text-primary)' }}>
            View All Messages
          </a>
        </div>
      </div>
    </div>
  )
}
