import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const TAG_COLORS = [
  { bg: '#E0F7FA', text: '#00838F' },
  { bg: '#F1F8E9', text: '#33691E' },
  { bg: '#E8EAF6', text: '#283593' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#FCE4EC', text: '#880E4F' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
  { bg: '#E0F2F1', text: '#004D40' },
  { bg: '#FFF8E1', text: '#F57F17' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [tags, setTags] = useState([])
  const [showNewTag, setShowNewTag] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  const searchParams = new URLSearchParams(location.search)
  const hasFavorite = searchParams.get('favorite') === 'true'
  const hasTagId = searchParams.has('tagId')
  const isAllNotes = location.pathname === '/workspace' && !hasFavorite && !hasTagId

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    const res = await fetch('/api/tags')
    if (res.ok) {
      const data = await res.json()
      setTags(data.tags)
    }
  }

  async function handleCreateTag(e) {
    e.preventDefault()
    if (!newTagName.trim()) return
    const color = TAG_COLORS[tags.length % TAG_COLORS.length]
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTagName.trim(), bgColor: color.bg, textColor: color.text }),
    })
    if (res.ok) {
      setNewTagName('')
      setShowNewTag(false)
      fetchTags()
    }
  }

  return (
    <aside className="w-[280px] h-full bg-surface border-r-2 border-border flex-col hidden md:flex shrink-0 z-10">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b-2 border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-heading font-bold text-xl shadow-[2px_2px_0px_#EDDFD0]">
            T
          </div>
          <h1 className="font-heading font-bold text-xl tracking-tight">TASHY</h1>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {/* Main Links */}
        <div className="space-y-2">
          <Link
            to="/workspace"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-bold transition-colors ${
              isAllNotes ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            All Notes
          </Link>
          <Link
            to="/workspace?favorite=true"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${
              hasFavorite ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            Favorites
          </Link>
        </div>

        {/* Tags */}
        <div>
          <h3 className="px-3 text-xs font-bold text-muted uppercase tracking-wider mb-3 font-heading">Tags</h3>
          <div className="space-y-1">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/workspace?tagId=${tag.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-md group transition-colors ${
                  searchParams.get('tagId') === tag.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: tag.bgColor, borderColor: tag.textColor }}
                  />
                  <span className="text-sm font-medium">{tag.name}</span>
                </div>
                <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  {tag.noteCount}
                </span>
              </Link>
            ))}
          </div>

          {showNewTag ? (
            <form onSubmit={handleCreateTag} className="mt-3 px-3 flex items-center gap-2">
              <input
                className="flex-1 bg-surface-container px-2 py-1.5 text-sm border-2 border-border rounded-md focus:border-primary outline-none"
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                autoFocus
                onBlur={() => { if (!newTagName.trim()) setShowNewTag(false) }}
              />
              <button type="submit" className="text-primary font-bold text-sm">Add</button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewTag(true)}
              className="mt-4 flex items-center gap-2 px-3 text-sm text-muted hover:text-primary transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Tag
            </button>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t-2 border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user?.username}</p>
          </div>
          <button onClick={logout} className="text-muted hover:text-primary transition-colors" title="Sign out">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
