import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/workspace', label: 'Workspace', icon: '⌗' },
  { to: '/tags', label: 'Tag Library', icon: '◉' },
]

export default function Sidebar() {
  return (
    <aside className="w-[280px] min-h-screen border-r-2 border-border bg-surface flex flex-col p-6 shrink-0">
      <h1 className="flex items-center text-xl font-bold font-heading text-primary mb-8">
        <img src="/logo.png" alt="" className="h-6 w-auto" />TASHY
      </h1>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md text-[15px] font-heading font-semibold transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-text hover:bg-background'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
