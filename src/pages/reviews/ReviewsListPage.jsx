import { useCallback, useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Pagination from '../../components/Pagination.jsx'
import Table from '../../components/Table.jsx'
import useFetch from '../../hooks/useFetch.js'
import { navigate } from '../../router/navigation.js'
import reviewService from '../../services/reviewService.js'
import { getSafePageAfterDelete, getTotalPages, paginate } from '../../utils/helpers.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'book', label: 'Book' },
  { key: 'author', label: 'Author' },
  { key: 'review', label: 'Review' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function ReviewsListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogState, setDialogState] = useState({
    open: false,
    review: null,
    loading: false,
    error: '',
  })
  const loadReviews = useCallback(() => reviewService.getAll(), [])
  const { data, loading, error, setData } = useFetch(loadReviews)
  const totalPages = useMemo(() => getTotalPages(data, PAGE_SIZE), [data])
  const currentRows = useMemo(() => paginate(data, currentPage, PAGE_SIZE), [currentPage, data])

  function closeDialog() {
    setDialogState({
      open: false,
      review: null,
      loading: false,
      error: '',
    })
  }

  function openDeleteDialog(review) {
    setDialogState({
      open: true,
      review,
      loading: false,
      error: '',
    })
  }

  async function handleDeleteConfirm() {
    if (!dialogState.review) {
      return
    }

    setDialogState((current) => ({
      ...current,
      loading: true,
      error: '',
    }))

    try {
      await reviewService.remove(dialogState.review.id)
      setData((current) => current.filter((review) => review.id !== dialogState.review.id))
      setCurrentPage((page) => getSafePageAfterDelete(data.length, page, PAGE_SIZE))
      closeDialog()
    } catch (deleteError) {
      setDialogState((current) => ({
        ...current,
        loading: false,
        error: deleteError.message || 'Could not delete review.',
      }))
    }
  }

  return (
    <section className="page">
      <PageHeader title="Reviews > List" subtitle="See book reviews across all authors." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading reviews..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={currentRows}
            renderRow={(review, index) => (
              <tr key={review.id}>
                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{review.bookName}</td>
                <td>{review.authorName}</td>
                <td>{review.review}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/reviews/${review.id}/edit`)} variant="secondary">
                      Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(review)} variant="danger">
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} />
        </>
      )}
      <ConfirmDialog
        error={dialogState.error}
        loading={dialogState.loading}
        message={`Delete the review for ${dialogState.review?.bookName ?? 'this book'} permanently?`}
        onCancel={closeDialog}
        onConfirm={handleDeleteConfirm}
        open={dialogState.open}
        title="Delete review"
      />
    </section>
  )
}

export default ReviewsListPage
