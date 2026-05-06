import { useCallback, useMemo } from 'react'
import AuthorForm from '../../components/AuthorForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'

function AuthorEditPage() {
  const authorId = useMemo(() => getRouteParams('/authors/:id/edit')?.id, [])
  const loadAuthor = useCallback(() => authorService.getById(authorId), [authorId])
  const { data, loading, error } = useFetch(loadAuthor)
  const initialValues = useMemo(() => ({ name: data?.name ?? '' }), [data])

  async function onSubmit(formValues) {
    await authorService.update(authorId, {
      name: formValues.name.trim(),
    })
    navigate('/authors')
  }

  return (
    <section className="page">
      <PageHeader title="Authors > Edit" />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading author..." />
      ) : error ? null : (
        <AuthorForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          submitLabel="Update"
        />
      )}
    </section>
  )
}

export default AuthorEditPage
