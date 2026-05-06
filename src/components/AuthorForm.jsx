import './Form.css';
import Button from './Button.jsx'
import ErrorMessage from './ErrorMessage.jsx'
import Input from './Input.jsx'
import useForm from '../hooks/useForm.js'
import { validateAuthor } from '../utils/validation.js'

function AuthorForm({ initialValues, onSubmit, submitLabel }) {
  const { values, errors, submitting, submitError, handleChange, handleSubmit } = useForm(initialValues, validateAuthor)

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage message={submitError} />
      <Input
        error={errors.name}
        label="Name"
        name="name"
        onChange={handleChange}
        placeholder="Enter author name"
        value={values.name}
      />
      <div className="form-actions">
        <Button disabled={submitting} type="submit">
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default AuthorForm
