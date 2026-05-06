import './Sidebar.css';
import { useEffect, useState } from 'react'
import { getCurrentPath, navigate } from '../router/navigation.js'

const sections = [
  {
    label: 'Authors',
    icon: (
      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
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
      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
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
      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    items: [
      { label: 'List', path: '/reviews' },
      { label: 'Create', path: '/reviews/create' },
    ],
  },
]

function getOpenSections(pathname) {
  return sections.reduce((open, section) => {
    open[section.label] = section.items.some((item) => pathname.startsWith(item.path))
    return open
  }, {})
}

function Sidebar() {
  const [pathname, setPathname] = useState(getCurrentPath())
  const [openSections, setOpenSections] = useState(() => getOpenSections(getCurrentPath()))

  useEffect(() => {
    function handleLocationChange() {
      const nextPath = getCurrentPath()
      setPathname(nextPath)
      setOpenSections((current) => ({ ...current, ...getOpenSections(nextPath) }))
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  function toggleSection(label) {
    setOpenSections((current) => ({ ...current, [label]: !current[label] }))
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span>Haibazo Books Review</span>
      </div>

      <nav aria-label="Main navigation" className="sidebar__nav">
        {sections.map((section) => {
          const isOpen = openSections[section.label]
          const sectionItemsId = `sidebar-${section.label.toLowerCase()}-items`

          return (
            <div className="sidebar__section" key={section.label}>
              <button aria-controls={sectionItemsId} aria-expanded={isOpen} className="sidebar__section-title" onClick={() => toggleSection(section.label)} type="button">
                <span className="sidebar__section-icon">{section.icon}</span>
                <span>{section.label}</span>
                <span aria-hidden="true" className={`sidebar__caret ${isOpen ? 'sidebar__caret--open' : ''}`}>
                  v
                </span>
              </button>

              <div className="sidebar__items" hidden={!isOpen} id={sectionItemsId}>
                {section.items.map((item) => (
                  <button className={`sidebar__link ${pathname === item.path ? 'sidebar__link--active' : ''}`} key={item.path} onClick={() => navigate(item.path)} type="button">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
