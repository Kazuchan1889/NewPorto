import { useState, useRef, useEffect } from 'react'
import { Save, AlertCircle, Sparkles, Upload, X, Image as ImageIcon } from 'lucide-react'

const getClampedCoords = (scale, x, y, ar) => {
  const W = ar >= 1.0 ? 256 * ar : 256;
  const H = ar >= 1.0 ? 256 : 256 / ar;
  const maxX = Math.max(0, 50 - 9600 / (scale * W));
  const maxY = Math.max(0, 50 - 9600 / (scale * H));
  return {
    x: Math.min(Math.max(x, -maxX), maxX),
    y: Math.min(Math.max(y, -maxY), maxY)
  };
};

export default function HeroContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef(null)
  const logoInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    firstName: 'Your',
    lastName: 'Name',
    title: 'Full Stack Developer',
    description: "I craft beautiful, high-performance web applications that blend stunning design with clean, scalable code. Let's build something extraordinary together.",
    freelanceBadge: 'Available for freelance work',
    statusBadge: 'Open to work 🚀',
    avatar: null,
    logo: null,
    avatarScale: 1.0,
    avatarX: 0,
    avatarY: 0,
    stats: [
      { id: 1, label: 'Years Exp.', value: '3+' },
      { id: 2, label: 'Projects', value: '20+' },
      { id: 3, label: 'Clients', value: '15+' }
    ]
  })

  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [tempAvatar, setTempAvatar] = useState(null)
  const [tempScale, setTempScale] = useState(1.0)
  const [tempX, setTempX] = useState(0)
  const [tempY, setTempY] = useState(0)
  const [imageAR, setImageAR] = useState(1.0)
  const [previewAR, setPreviewAR] = useState(1.0)

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ar = naturalWidth / naturalHeight;
      setImageAR(ar);
      
      // Clamp initial offsets with the loaded aspect ratio
      setTempX(prevX => {
        const W = ar >= 1.0 ? 256 * ar : 256;
        const maxX = Math.max(0, 50 - 9600 / (tempScale * W));
        return Math.min(Math.max(prevX, -maxX), maxX);
      });
      setTempY(prevY => {
        const H = ar >= 1.0 ? 256 : 256 / ar;
        const maxY = Math.max(0, 50 - 9600 / (tempScale * H));
        return Math.min(Math.max(prevY, -maxY), maxY);
      });
    }
  };

  const pointersRef = useRef({})
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const offsetStartRef = useRef({ x: 0, y: 0 })
  const initialPinchDistRef = useRef(0)
  const initialScaleRef = useRef(1.0)
  const initialMidpointRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handlePointerDown = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    
    pointersRef.current[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    const keys = Object.keys(pointersRef.current);
    
    if (keys.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      offsetStartRef.current = { x: tempX, y: tempY };
    } else if (keys.length === 2) {
      const p1 = pointersRef.current[keys[0]];
      const p2 = pointersRef.current[keys[1]];
      
      initialPinchDistRef.current = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      initialScaleRef.current = tempScale;
      
      initialMidpointRef.current = {
        x: (p1.clientX + p2.clientX) / 2,
        y: (p1.clientY + p2.clientY) / 2
      };
      offsetStartRef.current = { x: tempX, y: tempY };
    }
  };

  const handlePointerMove = (e) => {
    if (!pointersRef.current[e.pointerId]) return;
    
    pointersRef.current[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    const keys = Object.keys(pointersRef.current);
    
    const W = imageAR >= 1.0 ? 256 * imageAR : 256;
    const H = imageAR >= 1.0 ? 256 : 256 / imageAR;
    
    if (keys.length === 1 && isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      const deltaX = dx * 100 / (tempScale * W);
      const deltaY = dy * 100 / (tempScale * H);
      
      const newX = offsetStartRef.current.x + deltaX;
      const newY = offsetStartRef.current.y + deltaY;
      
      const clamped = getClampedCoords(tempScale, newX, newY, imageAR);
      setTempX(clamped.x);
      setTempY(clamped.y);
      
      // Prevent sticky boundary / drift
      const dxEffective = (clamped.x - offsetStartRef.current.x) * (tempScale * W / 100);
      const dyEffective = (clamped.y - offsetStartRef.current.y) * (tempScale * H / 100);
      dragStartRef.current = {
        x: dragStartRef.current.x + (dx - dxEffective),
        y: dragStartRef.current.y + (dy - dyEffective)
      };
    } else if (keys.length === 2) {
      const p1 = pointersRef.current[keys[0]];
      const p2 = pointersRef.current[keys[1]];
      
      const newDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      const midX = (p1.clientX + p2.clientX) / 2;
      const midY = (p1.clientY + p2.clientY) / 2;
      
      let newScale = tempScale;
      if (initialPinchDistRef.current > 0) {
        newScale = initialScaleRef.current * (newDist / initialPinchDistRef.current);
        newScale = Math.min(Math.max(newScale, 1.0), 5.0);
        setTempScale(newScale);
      }
      
      const dx = midX - initialMidpointRef.current.x;
      const dy = midY - initialMidpointRef.current.y;
      const deltaX = dx * 100 / (newScale * W);
      const deltaY = dy * 100 / (newScale * H);
      
      const newX = offsetStartRef.current.x + deltaX;
      const newY = offsetStartRef.current.y + deltaY;
      
      const clamped = getClampedCoords(newScale, newX, newY, imageAR);
      setTempX(clamped.x);
      setTempY(clamped.y);
      
      // Prevent sticky boundary / drift
      const dxEffective = (clamped.x - offsetStartRef.current.x) * (newScale * W / 100);
      const dyEffective = (clamped.y - offsetStartRef.current.y) * (newScale * H / 100);
      initialMidpointRef.current = {
        x: initialMidpointRef.current.x + (dx - dxEffective),
        y: initialMidpointRef.current.y + (dy - dyEffective)
      };
    }
  };

  const handlePointerUp = (e) => {
    const target = e.currentTarget;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {}
    
    delete pointersRef.current[e.pointerId];
    const keys = Object.keys(pointersRef.current);
    
    if (keys.length === 0) {
      isDraggingRef.current = false;
    } else if (keys.length === 1) {
      const singlePointer = pointersRef.current[keys[0]];
      dragStartRef.current = { x: singlePointer.clientX, y: singlePointer.clientY };
      offsetStartRef.current = { x: tempX, y: tempY };
      isDraggingRef.current = true;
    }
  };

  useEffect(() => {
    if (!isCropModalOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.003;
      const delta = -e.deltaY * zoomSpeed;
      setTempScale(prev => {
        const newScale = Math.min(Math.max(prev + delta, 1.0), 5.0);
        
        const W = imageAR >= 1.0 ? 256 * imageAR : 256;
        const H = imageAR >= 1.0 ? 256 : 256 / imageAR;
        
        setTempX(prevX => {
          const maxX = Math.max(0, 50 - 9600 / (newScale * W));
          return Math.min(Math.max(prevX, -maxX), maxX);
        });
        setTempY(prevY => {
          const maxY = Math.max(0, 50 - 9600 / (newScale * H));
          return Math.min(Math.max(prevY, -maxY), maxY);
        });
        
        return newScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isCropModalOpen]);


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
            logo: data.logoUrl || null,
            avatarScale: data.avatarScale ?? 1.0,
            avatarX: data.avatarX ?? 0,
            avatarY: data.avatarY ?? 0,
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
      // Validate that file type is PNG or JPG/JPEG
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG images are allowed.")
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempAvatar(reader.result)
        setTempScale(formData.avatarScale ?? 1.0)
        setTempX(formData.avatarX ?? 0)
        setTempY(formData.avatarY ?? 0)
        setIsCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, avatar: null, avatarScale: 1.0, avatarX: 0, avatarY: 0 }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate that file type is PNG or JPG/JPEG
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG images are allowed.")
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Logo image is too large. Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }))
    if (logoInputRef.current) logoInputRef.current.value = ''
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
        avatarScale: formData.avatarScale ?? 1.0,
        avatarX: formData.avatarX ?? 0,
        avatarY: formData.avatarY ?? 0,
        logoUrl: formData.logo,
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
                <img 
                  src={formData.avatar} 
                  alt="Avatar Preview" 
                  className="origin-center flex-shrink-0" 
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.target;
                    if (naturalWidth && naturalHeight) {
                      setPreviewAR(naturalWidth / naturalHeight);
                    }
                  }}
                  style={{
                    width: previewAR >= 1.0 ? 'auto' : '100%',
                    height: previewAR >= 1.0 ? '100%' : 'auto',
                    transform: `scale(${formData.avatarScale ?? 1.0}) translate(${formData.avatarX ?? 0}%, ${formData.avatarY ?? 0}%)`
                  }}
                />
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
              Recommended size: 500x500px. Supports PNG and JPG/JPEG only. Transparent backgrounds look best on dark mode.
            </p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/jpg"
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

              {formData.avatar && (
                <button 
                  type="button"
                  onClick={() => {
                    setTempAvatar(formData.avatar)
                    setTempScale(formData.avatarScale ?? 1.0)
                    setTempX(formData.avatarX ?? 0)
                    setTempY(formData.avatarY ?? 0)
                    setIsCropModalOpen(true)
                  }}
                  className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
                >
                  <Sparkles size={16} />
                  Adjust Position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Website Icon / Logo */}
      <div className="card rounded-2xl p-6 border-subtle space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Website Icon / Logo</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Logo Preview */}
          <div className="relative w-40 h-40 rounded-2xl border-2 border-dashed flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300" 
               style={{ borderColor: formData.logo ? 'transparent' : 'var(--border-brand)', background: 'var(--bg-elevated)' }}>
            {formData.logo ? (
              <>
                <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={removeLogo}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                <Upload size={24} className="mx-auto mb-2 opacity-50" />
                <span className="text-xs font-medium">No Logo</span>
              </div>
            )}
          </div>
          
          {/* Upload Controls */}
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Website Logo</h3>
            <p className="text-sm leading-relaxed max-w-sm mx-auto sm:mx-0" style={{ color: 'var(--text-muted)' }}>
              This icon will be used on the preloader screen and navigation bar. Recommended size: 200x200px. Supports PNG and JPG/JPEG only.
            </p>
            <div className="pt-2">
              <input 
                type="file" 
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden" 
                id="logo-upload"
              />
              <label 
                htmlFor="logo-upload"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      {/* Crop & Positioning Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full rounded-2xl border-subtle p-6 space-y-6 bg-dark-900/95 shadow-2xl relative flex flex-col items-center">
            
            <div className="w-full text-center">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Crop & Position Photo</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Align the photo within the bright circular cutout. The outer area will be cropped out.
              </p>
            </div>

            {/* Cutout Preview Frame */}
            <div 
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-subtle shadow-inner select-none cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
            >
              {/* Full image at 50% opacity in the background */}
              <div className="absolute inset-0 select-none pointer-events-none flex items-center justify-center">
                <img 
                  src={tempAvatar} 
                  alt="Base Preview" 
                  className="origin-center opacity-50 select-none pointer-events-none flex-shrink-0"
                  onLoad={handleImageLoad}
                  style={{
                    width: imageAR >= 1.0 ? 'auto' : '256px',
                    height: imageAR >= 1.0 ? '256px' : 'auto',
                    transform: `scale(${tempScale}) translate(${tempX}%, ${tempY}%)`
                  }}
                />
              </div>

              {/* Highlight circle in the center at 100% opacity */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border-2 border-primary-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.75)] overflow-hidden flex items-center justify-center">
                  <img 
                    src={tempAvatar} 
                    alt="Cutout Preview" 
                    className="origin-center select-none pointer-events-none flex-shrink-0"
                    style={{
                      width: imageAR >= 1.0 ? 'auto' : '256px',
                      height: imageAR >= 1.0 ? '256px' : 'auto',
                      transform: `scale(${tempScale}) translate(${tempX}%, ${tempY}%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Adjustments Section */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-subtle pb-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Adjust Position</span>
                <button 
                  type="button" 
                  onClick={() => { setTempScale(1.0); setTempX(0); setTempY(0); }}
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Reset Position
                </button>
              </div>
              
              <div className="text-center py-3 px-4 rounded-xl glass border border-subtle">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Drag photo to reposition
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
                  Scroll mouse wheel or pinch to zoom ({tempScale.toFixed(2)}x)
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-subtle">
              <button 
                type="button"
                onClick={() => {
                  setIsCropModalOpen(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-outline px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    avatar: tempAvatar,
                    avatarScale: tempScale,
                    avatarX: Math.round(tempX),
                    avatarY: Math.round(tempY)
                  }));
                  setIsCropModalOpen(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Save Photo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
