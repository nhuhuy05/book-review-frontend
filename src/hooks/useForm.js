import { useEffect, useState } from 'react'

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
    setSubmitError('')
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  function handleSubmit(onSubmit) {
    return async (event) => {
      event.preventDefault()

      const nextErrors = validate(values)
      setErrors(nextErrors)

      if (Object.keys(nextErrors).length > 0) {
        return
      }

      setSubmitting(true)
      setSubmitError('')

      try {
        await onSubmit(values)
      } catch (err) {
        setSubmitError(err.message || 'Something went wrong.')
        if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
          setErrors((current) => ({ ...current, ...err.fieldErrors }))
        }
      } finally {
        setSubmitting(false)
      }
    }
  }

  return {
    values,
    errors,
    submitting,
    submitError,
    handleChange,
    handleSubmit,
  }
}

export default useForm
