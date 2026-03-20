import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CommandCenter() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  // Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!user) return
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [user])

  // Fetch notes + tags when opened
  useEffect(() => {
    if (!open) return
    setQuery('')
    setSelectedIndex(0)
    Promise.all([
      fetch('/api/notes').then((r) => r.ok ? r.json() : { notes: [] }),
      fetch('/api/tags').then((r) => r.ok ? r.json() : { tags: [] }),
    ]).then(([notesData, tagsData]) => {
      setNotes(notesData.notes)
      setTags(tagsData.tags)
    })
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Filter results
  const getFiltered = useCallback(() => {
    if (!query.trim()) return notes
    const q = query.toLowerCase()
    return notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(q)
      const contentMatch = note.content.toLowerCase().includes(q)
      const noteTags = tags.filter((t) => note.tagIds.includes(t.id))
      const tagMatch = noteTags.some((t) => t.name.toLowerCase().includes(q))
      return titleMatch || contentMatch || tagMatch
    })
  }, [query, notes, tags])

  const filtered = getFiltered()

  // Separate snippets (has code) from notes
  const snippets = filtered.filter((n) => n.content.includes('```'))
  const plainNotes = filtered.filter((n) => !n.content.includes('```'))
  const allResults = [...snippets, ...plainNotes]

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return
    const selected = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (selected) selected.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = allResults[selectedIndex]
      if (item) {
        navigate(`/snippet/${item.id}`)
        setOpen(false)
      }
    }
  }

  function getNoteTags(note) {
    return tags.filter((t) => note.tagIds.includes(t.id))
  }

  function highlightMatch(text) {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-primary/20 text-primary px-0.5 rounded">{part}</span>
      ) : (
        part
      )
    )
  }

  if (!open) return null

  let globalIndex = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4"
      style={{ backgroundColor: 'rgba(43, 45, 66, 0.4)', backdropFilter: 'blur(2px)' }}
      onClick={() => setOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-surface w-full max-w-[600px] rounded-md border-2 border-border shadow-[4px_4px_0px_rgba(237,223,208,1)] flex flex-col overflow-hidden animate-[commandUp_150ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center border-b-2 border-border bg-surface relative h-16">
          <div className="pl-6 pr-3 text-muted flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">search</span>
          </div>
          <input
            ref={inputRef}
            className="w-full h-full bg-transparent border-none focus:ring-0 font-heading text-2xl text-on-surface placeholder:text-muted px-2 outline-none"
            placeholder="Type to search notes and snippets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="pr-6 pl-3 flex items-center">
            <kbd className="bg-background border border-border text-muted rounded px-1.5 py-0.5 text-xs font-bold font-heading">Esc</kbd>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto max-h-[400px] bg-surface py-2 command-results-scroll">
          {allResults.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted">
              <span className="material-symbols-outlined text-[40px] mb-2 block">search_off</span>
              <p className="font-heading font-bold">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <>
              {snippets.length > 0 && (
                <>
                  <div className="px-6 py-2 text-xs font-bold text-muted uppercase tracking-wider">Snippets</div>
                  {snippets.map((note) => {
                    const idx = globalIndex++
                    const noteTags = getNoteTags(note)
                    return (
                      <div
                        key={note.id}
                        data-index={idx}
                        onClick={() => { navigate(`/snippet/${note.id}`); setOpen(false) }}
                        className={`group flex items-center justify-between px-6 py-3 cursor-pointer border-l-4 transition-colors ${
                          idx === selectedIndex
                            ? 'bg-primary/10 border-primary'
                            : 'border-transparent hover:bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span
                            className={`material-symbols-outlined text-xl ${idx === selectedIndex ? 'text-primary' : 'text-muted'}`}
                            style={{ fontVariationSettings: idx === selectedIndex ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            code
                          </span>
                          <span className={`font-heading text-lg text-on-surface truncate ${idx === selectedIndex ? 'font-bold' : ''}`}>
                            {highlightMatch(note.title)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex gap-1.5">
                            {noteTags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                                style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          {idx === selectedIndex && (
                            <div className="flex items-center gap-1 text-muted text-xs">
                              <span className="font-heading">↵</span>
                              <span>to open</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}

              {plainNotes.length > 0 && (
                <>
                  <div className={`px-6 pt-4 pb-2 text-xs font-bold text-muted uppercase tracking-wider ${snippets.length > 0 ? 'mt-2 border-t border-border/50' : ''}`}>
                    Notes
                  </div>
                  {plainNotes.map((note) => {
                    const idx = globalIndex++
                    const noteTags = getNoteTags(note)
                    return (
                      <div
                        key={note.id}
                        data-index={idx}
                        onClick={() => { navigate(`/snippet/${note.id}`); setOpen(false) }}
                        className={`group flex items-center justify-between px-6 py-3 cursor-pointer border-l-4 transition-colors ${
                          idx === selectedIndex
                            ? 'bg-primary/10 border-primary'
                            : 'border-transparent hover:bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span
                            className={`material-symbols-outlined text-xl ${idx === selectedIndex ? 'text-primary' : 'text-muted'}`}
                            style={{ fontVariationSettings: idx === selectedIndex ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            description
                          </span>
                          <span className={`font-heading text-lg text-on-surface truncate ${idx === selectedIndex ? 'font-bold' : ''}`}>
                            {highlightMatch(note.title)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {noteTags.length > 0 ? (
                            <div className="flex gap-1.5">
                              {noteTags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap"
                                  style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted">
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                          {idx === selectedIndex && (
                            <div className="flex items-center gap-1 text-muted text-xs">
                              <span className="font-heading">↵</span>
                              <span>to open</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* Footer Hints */}
        <div className="border-t-2 border-border bg-background px-6 py-3 flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-bold font-heading shadow-sm">↑</kbd>
              <kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-bold font-heading shadow-sm">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="bg-surface border border-border rounded px-1.5 py-0.5 font-bold font-heading shadow-sm">↵</kbd>
              <span>Open</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Search by</span>
            <span className="font-bold">Title</span>
            <span>or</span>
            <span className="font-bold">Tag</span>
          </div>
        </div>
      </div>
    </div>
  )
}
