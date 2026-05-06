import { useCallback, useEffect, useState } from 'react'

function usePaginatedList(fetcher, pageSize) {
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [deleteItem, setDeleteItem] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const fetchPage = useCallback(async (pageToFetch, active) => {
    setLoading(true)
    setError('')

    try {
      // Backend pagination is 0-indexed
      const response = await fetcher(pageToFetch - 1, pageSize)
      if (active.current && response && response.success) {
        setData(response.data || [])
        setTotalPages(response.pagination?.totalPages || 0)
      } else if (active.current && response) {
        setError(response.message || 'Something went wrong.')
      }
    } catch (err) {
      if (active.current) {
        setError(err.message || 'Something went wrong.')
      }
    } finally {
      if (active.current) {
        setLoading(false)
      }
    }
  }, [fetcher, pageSize])

  useEffect(() => {
    const active = { current: true }
    fetchPage(currentPage, active)
    return () => {
      active.current = false
    }
  }, [currentPage, fetchPage])

  const removeItem = useCallback(() => {
    // Nếu page hiện tại chỉ còn 1 item và không phải page đầu, quay về page trước
    if (data.length <= 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else {
      const active = { current: true }
      fetchPage(currentPage, active)
    }
  }, [currentPage, fetchPage, data.length])

  const openDelete = useCallback((item) => {
    setDeleteItem(item)
    setDeleteLoading(false)
    setDeleteError('')
  }, [])

  const closeDelete = useCallback(() => {
    setDeleteItem(null)
    setDeleteLoading(false)
    setDeleteError('')
  }, [])

  const startDelete = useCallback(() => {
    setDeleteLoading(true)
    setDeleteError('')
  }, [])

  const failDelete = useCallback((message) => {
    setDeleteLoading(false)
    setDeleteError(message)
  }, [])

  return {
    loading,
    error,
    currentPage,
    currentRows: data,
    totalPages,
    setCurrentPage,
    removeItem,
    deleteItem,
    deleteLoading,
    deleteError,
    openDelete,
    closeDelete,
    startDelete,
    failDelete,
  }
}

export default usePaginatedList
