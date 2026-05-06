import { useCallback } from 'react'
import Button from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import { DeleteIcon, EditIcon } from '../../components/icons.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Pagination from '../../components/Pagination.jsx'
import Table from '../../components/Table.jsx'
import usePaginatedList from '../../hooks/usePaginatedList.js'
import { navigate } from '../../router/navigation.js'
import reviewService from '../../services/reviewService.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'book', label: 'Book' },
  { key: 'author', label: 'Author' },
  { key: 'review', label: 'Review' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function ReviewsListPage() {
  const loadReviews = useCallback(async (page, size) => {
    return await reviewService.getAll(page, size)
  }, [])
  const list = usePaginatedList(loadReviews, PAGE_SIZE)

  async function handleDeleteConfirm() {
    if (!list.deleteItem) {
      return
    }

    list.startDelete()

    try {
      await reviewService.remove(list.deleteItem.id)
      list.removeItem(list.deleteItem.id)
      list.closeDelete()
    } catch (deleteError) {
      list.failDelete(deleteError.message || 'Could not delete review.')
    }
  }

  return (
    <section className="page">
      <PageHeader title="Reviews > List" />
      <ErrorMessage message={list.error} />
      {list.loading ? (
        <Loading text="Loading reviews..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={list.currentRows}
            renderRow={(review, index) => (
              <tr key={review.id}>
                <td>{(list.currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{review.bookName}</td>
                <td>{review.authorName}</td>
                <td className="data-table__cell--long">{review.review}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/reviews/${review.id}/edit`)} variant="secondary">
                      {EditIcon} Edit
                    </Button>
                    <Button onClick={() => list.openDelete(review)} variant="danger">
                      {DeleteIcon} Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
          <Pagination currentPage={list.currentPage} onPageChange={list.setCurrentPage} totalPages={list.totalPages} />
        </>
      )}
      <ConfirmDialog
        error={list.deleteError}
        loading={list.deleteLoading}
        message={`Delete the review for ${list.deleteItem?.bookName ?? 'this book'} permanently?`}
        onCancel={list.closeDelete}
        onConfirm={handleDeleteConfirm}
        open={Boolean(list.deleteItem)}
        title="Delete review"
      />
    </section>
  )
}

export default ReviewsListPage
