import { useEffect, useState } from 'react'

function useFetch(fetcher) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function run() {
      setLoading(true)
      setError('')

      try {
        const result = await fetcher()

        if (active) {
          if (result && result.success !== undefined) {
            if (result.success) {
              setData(result.data || null)
            } else {
              setError(result.message || 'Something went wrong.')
            }
          } else {
            setData(result) // Fallback for APIs not wrapped in ApiResponse
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Something went wrong.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      active = false
    }
  }, [fetcher])

  return { data, loading, error, setData, setError }
}

export default useFetch
