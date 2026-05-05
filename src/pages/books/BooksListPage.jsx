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
      <PageHeader title="Books > List" />
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(book)} variant="danger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete
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
