import { useCallback, useMemo, useState } from 'react'
import AuthorForm from '../../components/AuthorForm.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Loading from '../../components/Loading.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import useFetch from '../../hooks/useFetch.js'
import { getRouteParams, navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'

function AuthorEditPage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const authorId = useMemo(() => getRouteParams('/authors/:id/edit')?.id, [])
  const loadAuthor = useCallback(() => authorService.getById(authorId), [authorId])
  const { data, loading, error } = useFetch(loadAuthor)

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await authorService.update(authorId, {
        name: formValues.name.trim(),
      })
      navigate('/authors')
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue.message || 'Could not update author.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Authors > Edit" subtitle="Update an existing author." />
      <ErrorMessage message={error} />
      {loading ? (
        <Loading text="Loading author..." />
      ) : error ? null : (
        <AuthorForm
          initialValues={{ name: data?.name ?? '' }}
          onSubmit={onSubmit}
          submitError={submitError}
          submitLabel="Update"
          submitting={submitting}
        />
      )}
    </section>
  )
}

export default AuthorEditPage
