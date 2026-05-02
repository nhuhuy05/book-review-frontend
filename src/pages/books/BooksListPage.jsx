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
import bookService from '../../services/bookService.js'
import reviewService from '../../services/reviewService.js'
import { buildReviewCountMap, getSafePageAfterDelete, getTotalPages, paginate } from '../../utils/helpers.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function BooksListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogState, setDialogState] = useState({
    open: false,
    book: null,
    loading: false,
    error: '',
  })
  const loadBooks = useCallback(async () => {
    const [books, reviews] = await Promise.all([bookService.getAll(), reviewService.getAll()])
    const reviewCounts = buildReviewCountMap(reviews)

    return books.map((book) => ({
      ...book,
      reviewCount: reviewCounts[book.name] ?? 0,
    }))
  }, [])
  const { data, loading, error, setData } = useFetch(loadBooks)
  const totalPages = useMemo(() => getTotalPages(data, PAGE_SIZE), [data])
  const currentRows = useMemo(() => paginate(data, currentPage, PAGE_SIZE), [currentPage, data])
  const selectedBook = dialogState.book
  const isBlocked = (selectedBook?.reviewCount ?? 0) > 0

  function closeDialog() {
    setDialogState({
      open: false,
      book: null,
      loading: false,
      error: '',
    })
  }

  function openDeleteDialog(book) {
    setDialogState({
      open: true,
      book,
      loading: false,
      error: '',
    })
  }

  async function handleDeleteConfirm() {
    if (!selectedBook || isBlocked) {
      return
    }

    setDialogState((current) => ({
      ...current,
      loading: true,
      error: '',
    }))

    try {
      await bookService.remove(selectedBook.id)
      setData((current) => current.filter((book) => book.id !== selectedBook.id))
      setCurrentPage((page) => getSafePageAfterDelete(data.length, page, PAGE_SIZE))
      closeDialog()
    } catch (deleteError) {
      setDialogState((current) => ({
        ...current,
        loading: false,
        error: deleteError.message || 'Could not delete book.',
      }))
    }
  }

  return (
    <section className="page">
      <PageHeader title="Books > List" subtitle="Browse books and their authors." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading books..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={currentRows}
            renderRow={(book, index) => (
              <tr key={book.id}>
                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{book.name}</td>
                <td>{book.authorName}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/books/${book.id}/edit`)} variant="secondary">
                      Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(book)} variant="danger">
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
        cancelText="Close"
        confirmText={isBlocked ? 'Go to Reviews' : 'Delete'}
        error={dialogState.error}
        intent={isBlocked ? 'primary' : 'danger'}
        loading={dialogState.loading}
        message={
          isBlocked
            ? `Delete all reviews for ${selectedBook?.name ?? 'this book'} before deleting the book.`
            : `Delete ${selectedBook?.name ?? 'this book'} permanently?`
        }
        onCancel={closeDialog}
        onConfirm={isBlocked ? () => navigate('/reviews') : handleDeleteConfirm}
        open={dialogState.open}
        title={isBlocked ? 'Cannot delete book yet' : 'Delete book'}
      />
    </section>
  )
}

export default BooksListPage
