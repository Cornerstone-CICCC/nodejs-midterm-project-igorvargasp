import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function NoteCard({ note, tags, onClick }) {
  const noteTags = tags.filter((t) => note.tagIds.includes(t.id))
  const hasCode = note.content.includes('```')

  return (
    <div
      className="bg-surface border-2 border-border rounded-md shadow-[4px_4px_0px_rgba(237,223,208,1)] hover:shadow-[6px_6px_0px_rgba(237,223,208,1)] hover:-translate-y-0.5 transition-all p-5 cursor-pointer group break-inside-avoid mb-6"
      onClick={onClick}
    >
      {/* Tags */}
      {noteTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {noteTags.map((tag) => (
            <span
              key={tag.id}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wide"
              style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="font-heading font-bold text-lg mb-2 text-on-surface group-hover:text-primary transition-colors">
        {note.title}
      </h3>

      {/* Content preview */}
      <div className="text-sm text-muted mb-4 line-clamp-4 prose-sm overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ fontSize: '12px', borderRadius: '6px', margin: '8px 0', padding: '12px' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
              if (!inline) {
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    PreTag="div"
                    customStyle={{ fontSize: '12px', borderRadius: '6px', margin: '8px 0', padding: '12px' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
              return (
                <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-code" {...props}>
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-2 leading-relaxed">{children}</p>
            },
          }}
        >
          {note.content.length > 500 ? note.content.slice(0, 500) + '...' : note.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">{hasCode ? 'code' : 'description'}</span>
          <span>{hasCode ? 'Snippet' : 'Note'}</span>
        </div>
        <span>{timeAgo(note.updatedAt)}</span>
      </div>
    </div>
  )
}
