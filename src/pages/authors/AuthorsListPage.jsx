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
import authorService from '../../services/authorService.js'
import bookService from '../../services/bookService.js'
import { buildBooksCountMap, getSafePageAfterDelete, getTotalPages, paginate } from '../../utils/helpers.js'

const columns = [
  { key: 'number', label: 'No' },
  { key: 'name', label: 'Name' },
  { key: 'books', label: 'Books' },
  { key: 'actions', label: 'Actions' },
]

const PAGE_SIZE = 5

function AuthorsListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogState, setDialogState] = useState({
    open: false,
    author: null,
    loading: false,
    error: '',
  })
  const loadAuthors = useCallback(async () => {
    const [authors, books] = await Promise.all([authorService.getAll(), bookService.getAll()])
    const bookCounts = buildBooksCountMap(books)

    return authors.map((author) => ({
      ...author,
      booksCount: bookCounts[author.name] ?? 0,
    }))
  }, [])
  const { data, loading, error, setData } = useFetch(loadAuthors)

  const totalPages = useMemo(() => getTotalPages(data, PAGE_SIZE), [data])
  const currentRows = useMemo(() => paginate(data, currentPage, PAGE_SIZE), [currentPage, data])
  const selectedAuthor = dialogState.author
  const isBlocked = (selectedAuthor?.booksCount ?? 0) > 0

  function closeDialog() {
    setDialogState({
      open: false,
      author: null,
      loading: false,
      error: '',
    })
  }

  function openDeleteDialog(author) {
    setDialogState({
      open: true,
      author,
      loading: false,
      error: '',
    })
  }

  async function handleDeleteConfirm() {
    if (!selectedAuthor || isBlocked) {
      return
    }

    setDialogState((current) => ({
      ...current,
      loading: true,
      error: '',
    }))

    try {
      await authorService.remove(selectedAuthor.id)
      setData((current) => current.filter((author) => author.id !== selectedAuthor.id))
      setCurrentPage((page) => getSafePageAfterDelete(data.length, page, PAGE_SIZE))
      closeDialog()
    } catch (deleteError) {
      setDialogState((current) => ({
        ...current,
        loading: false,
        error: deleteError.message || 'Could not delete author.',
      }))
    }
  }

  return (
    <section className="page">
      <PageHeader title="Authors > List" subtitle="Manage authors and see how many books each author has." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading authors..." />
      ) : (
        <>
          <Table
            columns={columns}
            rows={currentRows}
            renderRow={(author, index) => (
              <tr key={author.id}>
                <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                <td>{author.name}</td>
                <td>{author.booksCount}</td>
                <td className="data-table__actions">
                  <div className="action-group">
                    <Button onClick={() => navigate(`/authors/${author.id}/edit`)} variant="secondary">
                      Edit
                    </Button>
                    <Button onClick={() => openDeleteDialog(author)} variant="danger">
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
        confirmText={isBlocked ? 'Go to Books' : 'Delete'}
        error={dialogState.error}
        intent={isBlocked ? 'primary' : 'danger'}
        loading={dialogState.loading}
        message={
          isBlocked
            ? `Delete all books by ${selectedAuthor?.name ?? 'this author'} before deleting the author.`
            : `Delete ${selectedAuthor?.name ?? 'this author'} permanently?`
        }
        onCancel={closeDialog}
        onConfirm={isBlocked ? () => navigate('/books') : handleDeleteConfirm}
        open={dialogState.open}
        title={isBlocked ? 'Cannot delete author yet' : 'Delete author'}
      />
    </section>
  )
}

export default AuthorsListPage
