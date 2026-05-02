import { useCallback, useMemo, useState } from 'react'
import BookForm from '../../components/BookForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'
import bookService from '../../services/bookService.js'

function BookEditPage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const bookId = useMemo(() => getRouteParams('/books/:id/edit')?.id, [])
  const loadPageData = useCallback(async () => {
    const [book, authors] = await Promise.all([bookService.getById(bookId), authorService.getAll()])
    const selectedAuthor = authors.find((author) => author.name === book.authorName)

    return {
      book,
      authors,
      authorId: selectedAuthor?.id ? String(selectedAuthor.id) : '',
    }
  }, [bookId])
  const { data, loading, error } = useFetch(loadPageData)

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await bookService.update(bookId, {
        name: formValues.name.trim(),
        authorId: Number(formValues.authorId),
      })
      navigate('/books')
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue.message || 'Could not update book.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Books > Edit" subtitle="Update an existing book." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading book..." />
      ) : error ? null : (
        <BookForm
          authors={data?.authors ?? []}
          disabled={(data?.authors ?? []).length === 0}
          emptyMessage={(data?.authors ?? []).length === 0 ? 'Create an author first before updating a book.' : ''}
          initialValues={{ name: data?.book?.name ?? '', authorId: data?.authorId ?? '' }}
          onSubmit={onSubmit}
          submitError={submitError}
          submitLabel="Update"
          submitting={submitting}
        />
      )}
    </section>
  )
}

export default BookEditPage
