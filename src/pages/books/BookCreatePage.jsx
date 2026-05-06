import { useCallback } from 'react'
import BookForm from '../../components/BookForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'
import bookService from '../../services/bookService.js'

const EMPTY_BOOK_VALUES = { name: '', authorId: '' }

function BookCreatePage() {
  const loadAuthors = useCallback(() => authorService.getAll(0, 1000), [])
  const { data: authors, loading, error } = useFetch(loadAuthors)
  const hasAuthors = authors.length > 0

  async function onSubmit(formValues) {
    await bookService.create({
      name: formValues.name.trim(),
      authorId: Number(formValues.authorId),
    })
    navigate('/books')
  }

  return (
    <section className="page">
      <PageHeader title="Books > Create" />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading authors..." />
      ) : (
        <BookForm
          authors={authors}
          disabled={!hasAuthors}
          emptyMessage={!hasAuthors ? 'Create an author first before creating a book.' : ''}
          initialValues={EMPTY_BOOK_VALUES}
          onSubmit={onSubmit}
          submitLabel="Create"
        />
      )}
    </section>
  )
}

export default BookCreatePage
