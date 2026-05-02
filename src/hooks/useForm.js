import { useState } from 'react'

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

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

      await onSubmit(values)
    }
  }

  return {
    values,
    errors,
    setErrors,
    setValues,
    handleChange,
    handleSubmit,
  }
}

export default useForm
