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
import bookService from '../../services/bookService.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function BooksListPage() {
  const loadBooks = useCallback(async (page, size) => {
    return await bookService.getAll(page, size)
  }, [])
  const list = usePaginatedList(loadBooks, PAGE_SIZE)
  const selectedBook = list.deleteItem
  const isBlocked = (selectedBook?.reviewsCount ?? 0) > 0

  async function handleDeleteConfirm() {
    if (!selectedBook || isBlocked) {
      return
    }

    list.startDelete()

    try {
      await bookService.remove(selectedBook.id)
      list.removeItem(selectedBook.id)
      list.closeDelete()
    } catch (deleteError) {
      list.failDelete(deleteError.message || 'Could not delete book.')
    }
  }

  return (
    <section className="page">
      <PageHeader title="Books > List" />
      <ErrorMessage message={list.error} />
      {list.loading ? (
        <Loading text="Loading books..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={list.currentRows}
            renderRow={(book, index) => (
              <tr key={book.id}>
                <td>{(list.currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{book.name}</td>
                <td>{book.authorName}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/books/${book.id}/edit`)} variant="secondary">
                      {EditIcon} Edit
                    </Button>
                    <Button onClick={() => list.openDelete(book)} variant="danger">
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
        cancelText="Close"
        confirmText={isBlocked ? 'Go to Reviews' : 'Delete'}
        error={list.deleteError}
        intent={isBlocked ? 'primary' : 'danger'}
        loading={list.deleteLoading}
        message={
          isBlocked
            ? `Delete all reviews for ${selectedBook?.name ?? 'this book'} before deleting the book.`
            : `Delete ${selectedBook?.name ?? 'this book'} permanently?`
        }
        onCancel={list.closeDelete}
        onConfirm={isBlocked ? () => navigate('/reviews') : handleDeleteConfirm}
        open={Boolean(list.deleteItem)}
        title={isBlocked ? 'Cannot delete book yet' : 'Delete book'}
      />
    </section>
  )
}

export default BooksListPage
