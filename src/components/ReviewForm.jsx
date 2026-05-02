import { useEffect } from 'react'
import Button from './Button.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import Select from './Select.jsx'
import Textarea from './Textarea.jsx'
import useForm from '../hooks/useForm.js'
import { validateReview } from '../utils/validation.js'

function ReviewForm({
  initialValues,
  onSubmit,
  submitLabel,
  submitting,
  submitError,
  books,
  disabled = false,
  emptyMessage,
}) {
  const { values, errors, handleChange, handleSubmit, setValues } = useForm(initialValues, validateReview)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues, setValues])

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage message={submitError} />
      <Select error={errors.bookId} label="Book" name="bookId" onChange={handleChange} value={values.bookId}>
        <option value="">Select book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.name}
          </option>
        ))}
      </Select>
      <Textarea
        error={errors.review}
        label="Review"
        name="review"
        onChange={handleChange}
        placeholder="Write your review"
        rows={6}
        value={values.review}
      />
      {emptyMessage ? <div className="empty-inline">{emptyMessage}</div> : null}
      <div className="form-actions">
        <Button disabled={submitting || disabled} type="submit">
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ReviewForm
