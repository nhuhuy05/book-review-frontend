import { get, post, put, remove } from './http.js'

const authorService = {
  getAll: (page = 0, size = 5) => get(`/authors?page=${page}&size=${size}`),
  getById: (id) => get(`/authors/${id}`),
  create: (payload) => post('/authors', payload),
  update: (id, payload) => put(`/authors/${id}`, payload),
  remove: (id) => remove(`/authors/${id}`),
}

export default authorService
