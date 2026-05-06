import { get, post, put, remove } from './http.js'

const bookService = {
  getAll: (page = 0, size = 5) => get(`/books?page=${page}&size=${size}`),
  getById: (id) => get(`/books/${id}`),
  create: (payload) => post('/books', payload),
  update: (id, payload) => put(`/books/${id}`, payload),
  remove: (id) => remove(`/books/${id}`),
}

export default bookService
