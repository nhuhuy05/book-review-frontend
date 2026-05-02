export function paginate(items, currentPage, pageSize) {
  const start = (currentPage - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function getTotalPages(items, pageSize) {
  return Math.max(1, Math.ceil(items.length / pageSize))
}

export function buildBooksCountMap(books) {
  return books.reduce((counts, book) => {
    counts[book.authorName] = (counts[book.authorName] ?? 0) + 1
    return counts
  }, {})
}

export function buildReviewCountMap(reviews) {
  return reviews.reduce((counts, review) => {
    counts[review.bookName] = (counts[review.bookName] ?? 0) + 1
    return counts
  }, {})
}

export function getSafePageAfterDelete(itemsLength, currentPage, pageSize) {
  const nextLength = Math.max(0, itemsLength - 1)
  const nextTotalPages = Math.max(1, Math.ceil(nextLength / pageSize))
  return Math.min(currentPage, nextTotalPages)
}
