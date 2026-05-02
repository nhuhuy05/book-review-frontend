import { get, post, put, remove } from './http.js'

const authorService = {
  getAll: () => get('/authors'),
  getById: (id) => get(`/authors/${id}`),
  create: (payload) => post('/authors', payload),
  update: (id, payload) => put(`/authors/${id}`, payload),
  remove: (id) => remove(`/authors/${id}`),
}

export default authorService
