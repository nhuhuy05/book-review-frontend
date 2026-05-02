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
          setData(result)
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
