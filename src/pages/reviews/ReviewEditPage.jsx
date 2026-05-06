import { useCallback, useMemo } from 'react'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import ReviewForm from '../../components/ReviewForm.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import bookService from '../../services/bookService.js'
import reviewService from '../../services/reviewService.js'

function ReviewEditPage() {
  const reviewId = useMemo(() => getRouteParams('/reviews/:id/edit')?.id, [])
  const loadPageData = useCallback(async () => {
    const [reviewRes, booksRes] = await Promise.all([reviewService.getById(reviewId), bookService.getAll(0, 1000)])

    return {
      review: reviewRes.data,
      books: booksRes.data,
    }
  }, [reviewId])
  const { data, loading, error } = useFetch(loadPageData)
  const initialValues = useMemo(
    () => ({
      bookId: data?.review?.bookId ?? '',
      review: data?.review?.review ?? '',
    }),
    [data],
  )

  async function onSubmit(formValues) {
    await reviewService.update(reviewId, {
      bookId: Number(formValues.bookId),
      review: formValues.review.trim(),
    })
    navigate('/reviews')
  }

  return (
    <section className="page">
      <PageHeader title="Reviews > Edit" />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading review..." />
      ) : error ? null : (
        <ReviewForm
          books={data?.books ?? []}
          disabled={(data?.books ?? []).length === 0}
          emptyMessage={(data?.books ?? []).length === 0 ? 'Create a book first before updating a review.' : ''}
          initialValues={initialValues}
          onSubmit={onSubmit}
          submitLabel="Update"
        />
      )}
    </section>
  )
}

export default ReviewEditPage
