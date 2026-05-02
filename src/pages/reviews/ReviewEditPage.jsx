import { useCallback, useMemo, useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import ReviewForm from '../../components/ReviewForm.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import bookService from '../../services/bookService.js'
import reviewService from '../../services/reviewService.js'

function ReviewEditPage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const reviewId = useMemo(() => getRouteParams('/reviews/:id/edit')?.id, [])
  const loadPageData = useCallback(async () => {
    const [review, books] = await Promise.all([reviewService.getById(reviewId), bookService.getAll()])
    const selectedBook = books.find((book) => book.name === review.bookName)

    return {
      review,
      books,
      bookId: selectedBook?.id ? String(selectedBook.id) : '',
    }
  }, [reviewId])
  const { data, loading, error } = useFetch(loadPageData)

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await reviewService.update(reviewId, {
        bookId: Number(formValues.bookId),
        review: formValues.review.trim(),
      })
      navigate('/reviews')
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue.message || 'Could not update review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Reviews > Edit" subtitle="Update an existing review." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading review..." />
      ) : error ? null : (
        <ReviewForm
          books={data?.books ?? []}
          disabled={(data?.books ?? []).length === 0}
          emptyMessage={(data?.books ?? []).length === 0 ? 'Create a book first before updating a review.' : ''}
          initialValues={{ bookId: data?.bookId ?? '', review: data?.review?.review ?? '' }}
          onSubmit={onSubmit}
          submitError={submitError}
          submitLabel="Update"
          submitting={submitting}
        />
      )}
    </section>
  )
}

export default ReviewEditPage
