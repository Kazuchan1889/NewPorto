import { useState, useEffect, useRef } from 'react'
import { Save, Briefcase, Plus, Trash2, Link as LinkIcon, GitBranch, Image as ImageIcon, X, Tag, Upload, Sparkles } from 'lucide-react'

const getClampedCoords = (scale, x, y, ar) => {
  let W, H;
  if (ar >= 1.3333) {
    H = 180;
    W = 180 * ar;
  } else {
    W = 240;
    H = 240 / ar;
  }
  const maxX = Math.max(0, 50 - 12000 / (scale * W));
  const maxY = Math.max(0, 50 - 9000 / (scale * H));
  return {
    x: Math.min(Math.max(x, -maxX), maxX),
    y: Math.min(Math.max(y, -maxY), maxY)
  };
};

const cropImage = (imageSrc, scale, x, y, ar) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const origW = img.naturalWidth;
      const origH = img.naturalHeight;
      const imageAR = origW / origH;
      
      let W, H;
      if (imageAR >= 1.3333) {
        H = 180;
        W = 180 * imageAR;
      } else {
        W = 240;
        H = 240 / imageAR;
      }
      
      const ratioX = origW / (W * scale);
      const ratioY = origH / (H * scale);
      
      const cropWidth = 240 * ratioX;
      const cropHeight = 180 * ratioY;
      const cropX = origW * (0.5 - x / 100) - 120 * ratioX;
      const cropY = origH * (0.5 - y / 100) - 90 * ratioY;
      
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        800,
        600
      );
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = (err) => reject(err);
  });
};

export default function ProjectsContent() {
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRefs = useRef({})

  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [tempImage, setTempImage] = useState(null)
  const [tempScale, setTempScale] = useState(1.0)
  const [tempX, setTempX] = useState(0)
  const [tempY, setTempY] = useState(0)
  const [imageAR, setImageAR] = useState(1.0)

  const pointersRef = useRef({})
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const offsetStartRef = useRef({ x: 0, y: 0 })
  const initialPinchDistRef = useRef(0)
  const initialScaleRef = useRef(1.0)
  const initialMidpointRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ar = naturalWidth / naturalHeight;
      setImageAR(ar);
      
      setTempX(prevX => {
        let W, H;
        if (ar >= 1.3333) {
          H = 180;
          W = 180 * ar;
        } else {
          W = 240;
          H = 240 / ar;
        }
        const maxX = Math.max(0, 50 - 12000 / (tempScale * W));
        return Math.min(Math.max(prevX, -maxX), maxX);
      });
      setTempY(prevY => {
        let W, H;
        if (ar >= 1.3333) {
          H = 180;
          W = 180 * ar;
        } else {
          W = 240;
          H = 240 / ar;
        }
        const maxY = Math.max(0, 50 - 9000 / (tempScale * H));
        return Math.min(Math.max(prevY, -maxY), maxY);
      });
    }
  };

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
    
    let W, H;
    if (imageAR >= 1.3333) {
      H = 180;
      W = 180 * imageAR;
    } else {
      W = 240;
      H = 240 / imageAR;
    }
    
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
        
        let W, H;
        if (imageAR >= 1.3333) {
          H = 180;
          W = 180 * imageAR;
        } else {
          W = 240;
          H = 240 / imageAR;
        }
        
        setTempX(prevX => {
          const maxX = Math.max(0, 50 - 12000 / (newScale * W));
          return Math.min(Math.max(prevX, -maxX), maxX);
        });
        setTempY(prevY => {
          const maxY = Math.max(0, 50 - 9000 / (newScale * H));
          return Math.min(Math.max(prevY, -maxY), maxY);
        });
        
        return newScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isCropModalOpen, imageAR]);
  
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
            projects: data.projects && data.projects.length > 0
              ? data.projects.map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] }))
              : prev.projects
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
        setTempImage(reader.result)
        setActiveProjectId(id)
        setTempScale(1.0)
        setTempX(0)
        setTempY(0)
        setIsCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSavePhoto = async () => {
    try {
      const croppedBase64 = await cropImage(tempImage, tempScale, tempX, tempY, imageAR);
      handleProjectChange(activeProjectId, 'image', croppedBase64);
      setIsCropModalOpen(false);
      if (fileInputRefs.current[activeProjectId]) {
        fileInputRefs.current[activeProjectId].value = '';
      }
    } catch (err) {
      console.error(err);
      alert("Failed to crop image. Please try again.");
    }
  };

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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
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
                    <div className="relative w-full h-full group/thumb">
                      <img src={project.image} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setTempImage(project.image)
                            setActiveProjectId(project.id)
                            setTempScale(1.0)
                            setTempX(0)
                            setTempY(0)
                            setIsCropModalOpen(true)
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all flex items-center gap-1"
                        >
                          <Sparkles size={12} />
                          Adjust
                        </button>
                        <label 
                          htmlFor={`upload-${project.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Upload size={12} />
                          Change
                        </label>
                      </div>
                      <button 
                        onClick={() => removeImage(project.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-rose-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                        title="Remove Image"
                      >
                        <X size={12} />
                      </button>
                    </div>
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
                    accept="image/png, image/jpeg, image/jpg"
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
                Align the photo within the bright rectangular cutout. The outer area will be cropped out.
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
                  src={tempImage} 
                  alt="Base Preview" 
                  className="origin-center opacity-50 select-none pointer-events-none flex-shrink-0"
                  onLoad={handleImageLoad}
                  style={{
                    width: `${imageAR >= 1.3333 ? 180 * imageAR : 240}px`,
                    height: `${imageAR >= 1.3333 ? 180 : 240 / imageAR}px`,
                    transform: `scale(${tempScale}) translate(${tempX}%, ${tempY}%)`
                  }}
                />
              </div>

              {/* Highlight rectangle in the center at 100% opacity */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div 
                  className="relative w-[240px] h-[180px] rounded-xl border-2 border-primary-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.75)] overflow-hidden flex items-center justify-center"
                >
                  <img 
                    src={tempImage} 
                    alt="Cutout Preview" 
                    className="origin-center select-none pointer-events-none flex-shrink-0"
                    style={{
                      width: `${imageAR >= 1.3333 ? 180 * imageAR : 240}px`,
                      height: `${imageAR >= 1.3333 ? 180 : 240 / imageAR}px`,
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
                  if (fileInputRefs.current[activeProjectId]) {
                    fileInputRefs.current[activeProjectId].value = '';
                  }
                }}
                className="btn-outline px-5 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSavePhoto}
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
