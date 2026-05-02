import { useEffect } from 'react'
import Button from './Button.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import Input from './Input.jsx'
import Select from './Select.jsx'
import useForm from '../hooks/useForm.js'
import { validateBook } from '../utils/validation.js'

function BookForm({
  initialValues,
  onSubmit,
  submitLabel,
  submitting,
  submitError,
  authors,
  disabled = false,
  emptyMessage,
}) {
  const { values, errors, handleChange, handleSubmit, setValues } = useForm(initialValues, validateBook)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage message={submitError} />
      <Input
        error={errors.name}
        label="Title"
        name="name"
        onChange={handleChange}
        placeholder="Enter book title"
        value={values.name}
      />
      <Select error={errors.authorId} label="Author" name="authorId" onChange={handleChange} value={values.authorId}>
        <option value="">Select author</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </Select>
      {emptyMessage ? <div className="empty-inline">{emptyMessage}</div> : null}
      <div className="form-actions">
        <Button disabled={submitting || disabled} type="submit">
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default BookForm
