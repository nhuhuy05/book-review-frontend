import { useEffect, useState } from 'react'
import AuthorsListPage from '../pages/authors/AuthorsListPage.jsx'
import AuthorCreatePage from '../pages/authors/AuthorCreatePage.jsx'
import AuthorEditPage from '../pages/authors/AuthorEditPage.jsx'
import BooksListPage from '../pages/books/BooksListPage.jsx'
import BookCreatePage from '../pages/books/BookCreatePage.jsx'
import BookEditPage from '../pages/books/BookEditPage.jsx'
import ReviewsListPage from '../pages/reviews/ReviewsListPage.jsx'
import ReviewCreatePage from '../pages/reviews/ReviewCreatePage.jsx'
import ReviewEditPage from '../pages/reviews/ReviewEditPage.jsx'
import { getCurrentPath, matchPath } from './navigation.js'

const routes = [
  { path: '/', component: AuthorsListPage },
  { path: '/authors', component: AuthorsListPage },
  { path: '/authors/create', component: AuthorCreatePage },
  { path: '/authors/:id/edit', component: AuthorEditPage },
  { path: '/books', component: BooksListPage },
  { path: '/books/create', component: BookCreatePage },
  { path: '/books/:id/edit', component: BookEditPage },
  { path: '/reviews', component: ReviewsListPage },
  { path: '/reviews/create', component: ReviewCreatePage },
  { path: '/reviews/:id/edit', component: ReviewEditPage },
]

function Router() {
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

  const matchedRoute = routes.find((route) => matchPath(route.path, pathname))
  const Page = matchedRoute?.component ?? AuthorsListPage

  return <Page />
}

export default Router
