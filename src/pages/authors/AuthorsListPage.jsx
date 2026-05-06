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
import authorService from '../../services/authorService.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'name', label: 'Name' },
  { key: 'books', label: 'Books' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function AuthorsListPage() {
  const loadAuthors = useCallback(async (page, size) => {
    return await authorService.getAll(page, size)
  }, [])
  const list = usePaginatedList(loadAuthors, PAGE_SIZE)
  const selectedAuthor = list.deleteItem
  const isBlocked = (selectedAuthor?.booksCount ?? 0) > 0

  async function handleDeleteConfirm() {
    if (!selectedAuthor || isBlocked) {
      return
    }

    list.startDelete()

    try {
      await authorService.remove(selectedAuthor.id)
      list.removeItem(selectedAuthor.id)
      list.closeDelete()
    } catch (deleteError) {
      list.failDelete(deleteError.message || 'Could not delete author.')
    }
  }

  return (
    <section className="page">
      <PageHeader title="Authors > List" />
      <ErrorMessage message={list.error} />
      {list.loading ? (
        <Loading text="Loading authors..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={list.currentRows}
            renderRow={(author, index) => (
              <tr key={author.id}>
                <td>{(list.currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{author.name}</td>
                <td>{author.booksCount}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/authors/${author.id}/edit`)} variant="secondary">
                      {EditIcon} Edit
                    </Button>
                    <Button onClick={() => list.openDelete(author)} variant="danger">
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
        confirmText={isBlocked ? 'Go to Books' : 'Delete'}
        error={list.deleteError}
        intent={isBlocked ? 'primary' : 'danger'}
        loading={list.deleteLoading}
        message={
          isBlocked
            ? `Delete all books by ${selectedAuthor?.name ?? 'this author'} before deleting the author.`
            : `Delete ${selectedAuthor?.name ?? 'this author'} permanently?`
        }
        onCancel={list.closeDelete}
        onConfirm={isBlocked ? () => navigate('/books') : handleDeleteConfirm}
        open={Boolean(list.deleteItem)}
        title={isBlocked ? 'Cannot delete author yet' : 'Delete author'}
      />
    </section>
  )
}

export default AuthorsListPage
