import { useCallback, useMemo } from 'react'
import BookForm from '../../components/BookForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'
import bookService from '../../services/bookService.js'

function BookEditPage() {
  const bookId = useMemo(() => getRouteParams('/books/:id/edit')?.id, [])
  const loadPageData = useCallback(async () => {
    const [bookRes, authorsRes] = await Promise.all([bookService.getById(bookId), authorService.getAll(0, 1000)])

    return {
      book: bookRes.data,
      authors: authorsRes.data,
    }
  }, [bookId])
  const { data, loading, error } = useFetch(loadPageData)
  const initialValues = useMemo(
    () => ({
      name: data?.book?.name ?? '',
      authorId: data?.book?.authorId ?? '',
    }),
    [data],
  )

  async function onSubmit(formValues) {
    await bookService.update(bookId, {
      name: formValues.name.trim(),
      authorId: Number(formValues.authorId),
    })
    navigate('/books')
  }

  return (
    <section className="page">
      <PageHeader title="Books > Edit" />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading book..." />
      ) : error ? null : (
        <BookForm
          authors={data?.authors ?? []}
          disabled={(data?.authors ?? []).length === 0}
          emptyMessage={(data?.authors ?? []).length === 0 ? 'Create an author first before updating a book.' : ''}
          initialValues={initialValues}
          onSubmit={onSubmit}
          submitLabel="Update"
        />
      )}
    </section>
  )
}

export default BookEditPage
