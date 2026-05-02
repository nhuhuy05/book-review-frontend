import { get, post, put, remove } from './http.js'

const bookService = {
  getAll: () => get('/books'),
  getById: (id) => get(`/books/${id}`),
  create: (payload) => post('/books', payload),
  update: (id, payload) => put(`/books/${id}`, payload),
  remove: (id) => remove(`/books/${id}`),
}

export default bookService
