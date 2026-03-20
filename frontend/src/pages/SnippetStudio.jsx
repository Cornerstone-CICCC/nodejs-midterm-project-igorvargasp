import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function SnippetStudio() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagIds, setTagIds] = useState([])
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  const fetchTags = useCallback(async () => {
    const res = await fetch('/api/tags')
    if (res.ok) {
      const data = await res.json()
      setTags(data.tags)
    }
  }, [])

  const fetchNote = useCallback(async () => {
    if (isNew) return
    const res = await fetch(`/api/notes/${id}`)
    if (res.ok) {
      const data = await res.json()
      setTitle(data.note.title)
      setContent(data.note.content)
      setTagIds(data.note.tagIds)
    } else {
      navigate('/workspace')
    }
  }, [id, isNew, navigate])

  useEffect(() => {
    Promise.all([fetchTags(), fetchNote()]).finally(() => setLoading(false))
  }, [fetchTags, fetchNote])

  function toggleTag(tagId) {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    )
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    const body = { title: title.trim(), content, tagIds }
    if (isNew) {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        navigate(`/snippet/${data.note.id}`, { replace: true })
      }
    } else {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!id || isNew) return
    setDeleting(true)
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    navigate('/workspace')
  }

  const selectedTags = tags.filter((t) => tagIds.includes(t.id))
  const availableTags = tags.filter((t) => !tagIds.includes(t.id))

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-background animate-pulse">
        {/* Skeleton Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-border bg-surface shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-surface-container-high rounded-lg" />
            <div className="h-7 w-64 bg-surface-container-high rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 bg-surface-container-high rounded-lg" />
            <div className="h-8 w-24 bg-primary/20 rounded-lg" />
          </div>
        </div>
        {/* Skeleton Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 h-full border-r-2 border-border bg-background p-8 pt-12 space-y-3">
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-5/6 bg-surface-container-high rounded" />
            <div className="h-4 w-2/3 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded mt-4" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-1/2 bg-surface-container-high rounded" />
          </div>
          <div className="w-1/2 h-full bg-surface p-8 pt-12 space-y-4">
            <div className="h-8 w-1/2 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-5/6 bg-surface-container-high rounded" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            <div className="h-32 w-full bg-surface-container-high rounded-lg mt-4" />
            <div className="h-4 w-2/3 bg-surface-container-high rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b-2 border-border bg-surface shrink-0 z-10">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => navigate('/workspace')}
            className="text-muted hover:text-on-surface transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-background"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <input
            className="font-heading text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-muted w-full max-w-lg outline-none"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={isNew}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Selected tags */}
          {selectedTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wide flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
              title="Click to remove"
            >
              {tag.name}
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          ))}

          {/* Tag selector */}
          {availableTags.length > 0 && (
            <div className="relative">
              <select
                className="font-body text-sm font-bold appearance-none bg-surface border-2 border-border rounded-lg shadow-[4px_4px_0px_rgba(237,223,208,1)] pl-4 pr-10 py-2 text-on-surface focus:outline-none cursor-pointer hover:shadow-[6px_6px_0px_rgba(237,223,208,1)] transition-all"
                value=""
                onChange={(e) => {
                  if (e.target.value) toggleTag(e.target.value)
                }}
              >
                <option value="" disabled>Add Tag...</option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">expand_more</span>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="font-heading text-[15px] font-semibold bg-primary text-white px-6 py-2 rounded-lg shadow-[4px_4px_0px_rgba(237,223,208,1)] hover:shadow-[6px_6px_0px_rgba(237,223,208,1)] active:shadow-[2px_2px_0px_rgba(237,223,208,1)] active:translate-y-[2px] active:translate-x-[2px] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Split Pane */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <section className="w-1/2 h-full flex flex-col border-r-2 border-border bg-background relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setShowCheatSheet(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-muted font-heading uppercase tracking-widest bg-surface/80 px-2.5 py-1 rounded border-2 border-border backdrop-blur-sm hover:text-primary hover:border-primary/50 transition-colors"
              title="Markdown cheat sheet"
            >
              <span className="material-symbols-outlined text-[16px]">help</span>
              Markdown
            </button>
            <div className="text-xs font-bold text-muted font-heading uppercase tracking-widest bg-surface/80 px-2 py-1 rounded border-2 border-border backdrop-blur-sm">
              Editor
            </div>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent border-none focus:ring-0 p-8 pt-16 md:pt-12 font-code text-[14px] leading-relaxed text-on-surface resize-none placeholder:text-muted/50 outline-none"
            placeholder={"# Describe your note here...\n\nWrite in **Markdown** syntax.\n\n```javascript\n// Add code snippets like this\n```"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </section>

        {/* Preview Pane */}
        <section className="w-1/2 h-full flex flex-col bg-surface relative">
          <div className="absolute top-4 right-4 text-xs font-bold text-muted font-heading uppercase tracking-widest bg-background/80 px-2 py-1 rounded border-2 border-border backdrop-blur-sm z-10">
            Preview
          </div>
          <div className="flex-1 overflow-y-auto p-8 pt-12 prose-editor">
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1({ children }) {
                    return <h1 className="font-heading text-3xl font-bold mb-4 text-on-surface">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="font-heading text-2xl font-bold mb-3 mt-6 text-on-surface">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="font-heading text-xl font-semibold mb-2 mt-4 text-on-surface">{children}</h3>
                  },
                  p({ children }) {
                    return <p className="text-on-surface leading-relaxed mb-4">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-6 mb-4 space-y-1 text-on-surface">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-6 mb-4 space-y-1 text-on-surface">{children}</ol>
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-4 border-border pl-4 text-muted italic my-4">{children}</blockquote>
                  },
                  a({ href, children }) {
                    return <a href={href} className="text-primary underline underline-offset-2 hover:brightness-110">{children}</a>
                  },
                  strong({ children }) {
                    return <strong className="font-bold text-on-surface">{children}</strong>
                  },
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline && match) {
                      return (
                        <div className="my-4 rounded-lg overflow-hidden border-2 border-gray-800">
                          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs font-code font-bold text-gray-400 uppercase">{match[1]}</span>
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, fontSize: '13px', padding: '16px', borderRadius: 0 }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                    if (!inline) {
                      return (
                        <div className="my-4 rounded-lg overflow-hidden border-2 border-gray-800">
                          <SyntaxHighlighter
                            style={oneDark}
                            PreTag="div"
                            customStyle={{ margin: 0, fontSize: '13px', padding: '16px', borderRadius: 0 }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                    return (
                      <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-sm font-code text-primary" {...props}>
                        {children}
                      </code>
                    )
                  },
                  hr() {
                    return <hr className="border-t-2 border-border my-6" />
                  },
                  table({ children }) {
                    return <table className="w-full border-collapse border-2 border-border my-4 text-sm">{children}</table>
                  },
                  th({ children }) {
                    return <th className="border-2 border-border bg-surface-container px-3 py-2 text-left font-bold">{children}</th>
                  },
                  td({ children }) {
                    return <td className="border-2 border-border px-3 py-2">{children}</td>
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted">
                <span className="material-symbols-outlined text-[48px] mb-3">visibility</span>
                <p className="font-heading font-bold">Live Preview</p>
                <p className="text-sm mt-1">Start writing to see the preview here</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Delete Button */}
      {!isNew && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute bottom-8 right-8 w-12 h-12 bg-surface text-muted hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center border-2 border-border shadow-[4px_4px_0px_rgba(237,223,208,1)] hover:shadow-[6px_6px_0px_rgba(237,223,208,1)] hover:-translate-y-1 transition-all z-20"
          title="Delete note"
        >
          <span className="material-symbols-outlined text-[22px]">delete</span>
        </button>
      )}

      {/* Markdown Cheat Sheet Modal */}
      {showCheatSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCheatSheet(false)}>
          <div
            className="bg-surface border-2 border-border rounded-lg shadow-[6px_6px_0px_rgba(237,223,208,1)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                <h2 className="font-heading font-bold text-xl">Markdown Cheat Sheet</h2>
              </div>
              <button onClick={() => setShowCheatSheet(false)} className="p-2 text-muted hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Headings */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Headings</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p># Heading 1</p>
                    <p>## Heading 2</p>
                    <p>### Heading 3</p>
                  </div>
                </div>

                {/* Emphasis */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Emphasis</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>**bold text**</p>
                    <p>*italic text*</p>
                    <p>~~strikethrough~~</p>
                  </div>
                </div>

                {/* Lists */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Lists</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>- Unordered item</p>
                    <p>- Another item</p>
                    <p className="mt-2">1. Ordered item</p>
                    <p>2. Another item</p>
                  </div>
                </div>

                {/* Links & Images */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Links & Images</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>[link text](https://url.com)</p>
                    <p>![alt text](image-url.png)</p>
                  </div>
                </div>

                {/* Code */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Code</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>`inline code`</p>
                    <p className="mt-2">```javascript</p>
                    <p>// code block</p>
                    <p>const x = 42;</p>
                    <p>```</p>
                  </div>
                </div>

                {/* Blockquotes */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Blockquotes</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>&gt; This is a quote</p>
                    <p>&gt; It can span lines</p>
                  </div>
                </div>

                {/* Tables */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Tables</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>| Header | Header |</p>
                    <p>| ------ | ------ |</p>
                    <p>| Cell   | Cell   |</p>
                  </div>
                </div>

                {/* Horizontal Rule & Others */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-primary">Other</h3>
                  <div className="bg-background rounded-lg border-2 border-border p-3 font-code text-xs leading-relaxed">
                    <p>--- (horizontal rule)</p>
                    <p className="mt-2">- [x] Task done</p>
                    <p>- [ ] Task pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
