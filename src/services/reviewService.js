import { get, post, put, remove } from './http.js'

const reviewService = {
  getAll: () => get('/reviews'),
  getById: (id) => get(`/reviews/${id}`),
  create: (payload) => post('/reviews', payload),
  update: (id, payload) => put(`/reviews/${id}`, payload),
  remove: (id) => remove(`/reviews/${id}`),
}

export default reviewService
