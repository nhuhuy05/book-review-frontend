import AuthorForm from '../../components/AuthorForm.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { navigate } from '../../router/navigation.js'
import authorService from '../../services/authorService.js'

const EMPTY_AUTHOR_VALUES = { name: '' }

function AuthorCreatePage() {
  async function onSubmit(formValues) {
    await authorService.create({
      name: formValues.name.trim(),
    })
    navigate('/authors')
  }

  return (
    <section className="page">
      <PageHeader title="Authors > Create" />
      <AuthorForm
        initialValues={EMPTY_AUTHOR_VALUES}
        onSubmit={onSubmit}
        submitLabel="Create"
      />
    </section>
  )
}

export default AuthorCreatePage
