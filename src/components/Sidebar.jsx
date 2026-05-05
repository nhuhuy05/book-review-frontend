import { useEffect, useState } from 'react'
import { getCurrentPath, navigate } from '../router/navigation.js'

const sections = [
  {
    label: 'Authors',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    items: [
      { label: 'List', path: '/authors' },
      { label: 'Create', path: '/authors/create' },
    ],
  },
  {
    label: 'Books',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    items: [
      { label: 'List', path: '/books' },
      { label: 'Create', path: '/books/create' },
    ],
  },
  {
    label: 'Reviews',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    items: [
      { label: 'List', path: '/reviews' },
      { label: 'Create', path: '/reviews/create' },
    ],
  },
]

function Sidebar() {
  const [pathname, setPathname] = useState(getCurrentPath())
  const [openSections, setOpenSections] = useState(() => {
    const initialOpen = {}
    sections.forEach((section) => {
      initialOpen[section.label] = section.items.some((item) => getCurrentPath().startsWith(item.path))
    })
    return initialOpen
  })

  useEffect(() => {
    function handleLocationChange() {
      const currentPath = getCurrentPath()
      setPathname(currentPath)
      
      // Optionally auto-open the section we navigated to
      setOpenSections(prev => {
        const next = { ...prev }
        sections.forEach((section) => {
          if (section.items.some((item) => currentPath.startsWith(item.path))) {
            next[section.label] = true
          }
        })
        return next
      })
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const toggleSection = (label) => {
    setOpenSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span>Haibazo Books Review</span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {sections.map((section) => {
          const isOpen = openSections[section.label]

          return (
            <div className="sidebar__section" key={section.label}>
              <div 
                className="sidebar__section-title" 
                onClick={() => toggleSection(section.label)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <span className="sidebar__section-icon">
                  {section.icon}
                </span>
                <span>{section.label}</span>
                <span 
                  className="sidebar__caret" 
                  style={{ 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                    transition: 'transform 200ms ease'
                  }}
                >
                  ▾
                </span>
              </div>

              {isOpen && (
                <div className="sidebar__items">
                  {section.items.map((item) => (
                    <button
                      className={`sidebar__link ${pathname === item.path ? 'sidebar__link--active' : ''}`}
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
