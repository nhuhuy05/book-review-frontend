import { useCallback, useMemo, useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import ReviewForm from '../../components/ReviewForm.jsx'
import useFetch from '../../hooks/useFetch.js'
import { navigate } from '../../router/navigation.js'
import bookService from '../../services/bookService.js'
import reviewService from '../../services/reviewService.js'

function ReviewCreatePage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loadBooks = useCallback(() => bookService.getAll(), [])
  const { data: books, loading, error } = useFetch(loadBooks)
  const hasBooks = useMemo(() => books.length > 0, [books])

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await reviewService.create({
        bookId: Number(formValues.bookId),
        review: formValues.review.trim(),
      })
      navigate('/reviews')
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue.message || 'Could not create review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Reviews > Create" />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading books..." />
      ) : (
        <ReviewForm
          books={books}
          disabled={!hasBooks}
          emptyMessage={!hasBooks ? 'Create a book first before creating a review.' : ''}
          initialValues={{ bookId: '', review: '' }}
          onSubmit={onSubmit}
          submitError={submitError}
          submitLabel="Create"
          submitting={submitting}
        />
      )}
    </section>
  )
}

export default ReviewCreatePage
