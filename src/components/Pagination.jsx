function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          className={`pagination__button ${page === currentPage ? 'pagination__button--active' : ''}`}
          key={page}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
    </div>
  )
}

export default Pagination
