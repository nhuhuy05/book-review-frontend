import { useCallback, useMemo, useState } from 'react'
import BookForm from '../../components/BookForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'
import bookService from '../../services/bookService.js'

function BookCreatePage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loadAuthors = useCallback(() => authorService.getAll(), [])
  const { data: authors, loading, error } = useFetch(loadAuthors)
  const hasAuthors = useMemo(() => authors.length > 0, [authors])

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await bookService.create({
        name: formValues.name.trim(),
        authorId: Number(formValues.authorId),
      })
      navigate('/books')
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue.message || 'Could not create book.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Books > Create" subtitle="Create a book and link it to an author." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading authors..." />
      ) : (
        <BookForm
          authors={authors}
          disabled={!hasAuthors}
          emptyMessage={!hasAuthors ? 'Create an author first before creating a book.' : ''}
          initialValues={{ name: '', authorId: '' }}
          onSubmit={onSubmit}
          submitError={submitError}
          submitLabel="Create"
          submitting={submitting}
        />
      )}
    </section>
  )
}

export default BookCreatePage
