import { useState } from 'react'
import AuthorForm from '../../components/AuthorForm.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'

function AuthorCreatePage() {
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(formValues) {
    setSubmitting(true)
    setSubmitError('')

    try {
      await authorService.create({
        name: formValues.name.trim(),
      })
      navigate('/authors')
    } catch (error) {
      setSubmitError(error.message || 'Could not create author.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page">
      <PageHeader title="Authors > Create" />
      <AuthorForm
        initialValues={{ name: '' }}
        onSubmit={onSubmit}
        submitError={submitError}
        submitLabel="Create"
        submitting={submitting}
      />
    </section>
  )
}

export default AuthorCreatePage
