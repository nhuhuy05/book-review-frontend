import { useCallback } from 'react'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import ReviewForm from '../../components/ReviewForm.jsx'
import useFetch from '../../hooks/useFetch.js'
import { navigate } from '../../router/navigation.js'
import bookService from '../../services/bookService.js'
import reviewService from '../../services/reviewService.js'

const EMPTY_REVIEW_VALUES = { bookId: '', review: '' }

function ReviewCreatePage() {
  const loadBooks = useCallback(() => bookService.getAll(0, 1000), [])
  const { data: books, loading, error } = useFetch(loadBooks)
  const hasBooks = books.length > 0

  async function onSubmit(formValues) {
    await reviewService.create({
      bookId: Number(formValues.bookId),
      review: formValues.review.trim(),
    })
    navigate('/reviews')
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
          initialValues={EMPTY_REVIEW_VALUES}
          onSubmit={onSubmit}
          submitLabel="Create"
        />
      )}
    </section>
  )
}

export default ReviewCreatePage
