import { useEffect, useState } from "react"

export function useSubscriptionStatus(phone: string) {
  const [status, setStatus] = useState<{ active: boolean, plan?: string, expires?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!phone || !/^07\d{8}$/.test(phone)) {
      setStatus(null)
      return
    }
    setLoading(true)
    fetch(`http://localhost:4000/subscription/${phone}`)
      .then(res => res.json())
      .then(data => {
        setStatus(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to check subscription status.")
        setLoading(false)
      })
  }, [phone])

  return { status, loading, error }
}
