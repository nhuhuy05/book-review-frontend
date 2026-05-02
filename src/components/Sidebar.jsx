import { useEffect, useState } from 'react'
import { getCurrentPath, navigate } from '../router/navigation.js'

const sections = [
  {
    label: 'Authors',
    items: [
      { label: 'List', path: '/authors' },
      { label: 'Create', path: '/authors/create' },
    ],
  },
  {
    label: 'Books',
    items: [
      { label: 'List', path: '/books' },
      { label: 'Create', path: '/books/create' },
    ],
  },
  {
    label: 'Reviews',
    items: [
      { label: 'List', path: '/reviews' },
      { label: 'Create', path: '/reviews/create' },
    ],
  },
]

function Sidebar() {
  const [pathname, setPathname] = useState(getCurrentPath())

  useEffect(() => {
    function handleLocationChange() {
      setPathname(getCurrentPath())
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav" aria-label="Main navigation">
        {sections.map((section) => {
          const isOpen = section.items.some((item) => pathname.startsWith(item.path))

          return (
            <div className="sidebar__section" key={section.label}>
              <div className="sidebar__section-title">
                <span className="sidebar__section-icon" />
                <span>{section.label}</span>
                <span className="sidebar__caret">{isOpen ? '^' : 'v'}</span>
              </div>

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
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
