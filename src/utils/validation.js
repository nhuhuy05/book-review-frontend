export function validateRequired(value, message) {
  if (String(value ?? '').trim()) {
    return ''
  }

  return message
}

export function validateAuthor(values) {
  const errors = {}
  const nameError = validateRequired(values.name, 'Please enter name.')

  if (nameError) {
    errors.name = nameError
  }

  return errors
}

export function validateBook(values) {
  const errors = {}
  const nameError = validateRequired(values.name, 'Please enter name.')
  const authorError = validateRequired(values.authorId, 'Please select author.')

  if (nameError) {
    errors.name = nameError
  }

  if (authorError) {
    errors.authorId = authorError
  }

  return errors
}

export function validateReview(values) {
  const errors = {}
  const bookError = validateRequired(values.bookId, 'Please select book.')
  const reviewError = validateRequired(values.review, 'Please enter review.')

  if (bookError) {
    errors.bookId = bookError
  }

  if (reviewError) {
    errors.review = reviewError
  }

  return errors
}
