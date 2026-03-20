import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import NoteCard from '../components/NoteCard'

export default function Workspace() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [sortOrder, setSortOrder] = useState('latest')
  const [loading, setLoading] = useState(true)

  const tagId = searchParams.get('tagId')
  const favorite = searchParams.get('favorite')

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams()
    if (tagId) params.set('tagId', tagId)
    if (favorite) params.set('favorite', favorite)
    const res = await fetch(`/api/notes?${params}`)
    if (res.ok) {
      const data = await res.json()
      setNotes(data.notes)
    }
  }, [tagId, favorite])

  const fetchTags = useCallback(async () => {
    const res = await fetch('/api/tags')
    if (res.ok) {
      const data = await res.json()
      setTags(data.tags)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchNotes(), fetchTags()]).finally(() => setLoading(false))
  }, [fetchNotes, fetchTags])

  let filtered = notes

  // Sort
  if (sortOrder === 'oldest') {
    filtered = [...filtered].reverse()
  }

  // Active tag name for header
  const activeTag = tags.find((t) => t.id === tagId)
  const headerTitle = favorite ? 'Favorites' : activeTag ? activeTag.name : 'All Notes'

  return (
    <>
      {/* Top Navigation */}
      <header className="h-20 bg-surface/80 backdrop-blur-md border-b-2 border-border flex items-center justify-between px-6 lg:px-10 shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-2xl font-bold">{headerTitle}</h2>
          <span className="bg-surface-container-high text-muted text-xs font-bold px-2 py-1 rounded-full border border-outline-variant hidden sm:inline-block">
            {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-8 hidden sm:block">
          <div
            className="relative group cursor-pointer"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <div className="block w-full pl-10 pr-16 py-2.5 border-2 border-border rounded-md bg-background text-muted text-sm group-hover:border-primary/50 transition-colors">
              Search notes, tags, or content...
            </div>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="inline-flex items-center px-2 py-0.5 rounded text-xs font-code font-bold bg-surface border border-border text-muted shadow-sm">
                Ctrl K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
            className="p-2 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            title={`Sort: ${sortOrder}`}
          >
            <span className="material-symbols-outlined">swap_vert</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
        <div className="max-w-[1400px] mx-auto">
          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSortOrder('latest')}
              className={`px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-bold shadow-sm shrink-0 transition-colors ${
                sortOrder === 'latest' ? 'border-primary text-primary' : 'text-muted hover:border-primary'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-medium shadow-sm shrink-0 transition-colors ${
                sortOrder === 'oldest' ? 'border-primary text-primary' : 'text-muted hover:border-primary'
              }`}
            >
              Oldest
            </button>
            {tags.length > 0 && <div className="w-px h-6 bg-border mx-2 shrink-0" />}
            {tags.map((tag) => (
              <a
                key={tag.id}
                href={`/workspace?tagId=${tag.id}`}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-colors ${
                  tagId === tag.id ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: tag.bgColor,
                  color: tag.textColor,
                  borderColor: tag.textColor + '30',
                }}
              >
                {tag.name}
              </a>
            ))}
          </div>

          {/* Masonry Grid */}
          {loading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface border-2 border-border rounded-md shadow-[4px_4px_0px_rgba(237,223,208,1)] p-5 mb-6 break-inside-avoid animate-pulse">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-16 bg-surface-container-high rounded" />
                    <div className="h-5 w-12 bg-surface-container-high rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-surface-container-high rounded mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-3 w-full bg-surface-container-high rounded" />
                    <div className="h-3 w-5/6 bg-surface-container-high rounded" />
                  </div>
                  {i % 2 === 0 && (
                    <div className="h-24 w-full bg-code-bg rounded-md" />
                  )}
                  <div className="mt-4 pt-3 border-t border-border flex justify-between">
                    <div className="h-3 w-16 bg-surface-container-high rounded" />
                    <div className="h-3 w-12 bg-surface-container-high rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="material-symbols-outlined text-[64px] text-muted mb-4">note_add</span>
              <h3 className="font-heading font-bold text-xl text-muted mb-2">No notes yet</h3>
              <p className="text-muted text-sm mb-6">Create your first note to get started</p>
              <button
                onClick={() => navigate('/snippet/new')}
                className="px-6 py-3 bg-primary text-white font-bold rounded-md shadow-[3px_3px_0px_rgba(237,223,208,1)] hover:shadow-[4px_4px_0px_rgba(237,223,208,1)] hover:-translate-y-0.5 transition-all"
              >
                Create Note
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} tags={tags} onClick={() => navigate(`/snippet/${note.id}`)} />
              ))}
            </div>
          )}

          <div className="h-24" />
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/snippet/new')}
        className="absolute bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center border-2 border-border shadow-[4px_4px_0px_rgba(237,223,208,1)] hover:shadow-[6px_6px_0px_rgba(237,223,208,1)] hover:-translate-y-1 transition-all z-20 group"
      >
        <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform duration-300">add</span>
        <div className="absolute right-full mr-4 bg-on-surface text-surface text-sm font-bold px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-heading">
          New Note
        </div>
      </button>
    </>
  )
}
