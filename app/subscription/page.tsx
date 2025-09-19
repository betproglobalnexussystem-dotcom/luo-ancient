
"use client"
import { useState } from "react"
import { useSubscriptionStatus } from "../../hooks/use-subscription-status"

const PLANS = [
  { id: "access2days", name: "2 Days Access", price: 5000 },
  { id: "week", name: "1 Week", price: 10000 },
  { id: "twoweeks", name: "2 Weeks", price: 17000 },
  { id: "month", name: "1 Month", price: 30000 },
  { id: "threemonth", name: "3 Months", price: 70000 },
  { id: "sixmonth", name: "6 Months", price: 120000 },
  { id: "year", name: "1 Year", price: 200000 },
]

export default function SubscriptionPage() {
  const [phone, setPhone] = useState("")
  const [plan, setPlan] = useState(PLANS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | { message?: string }>("")
  const { status, loading: statusLoading, error: statusError } = useSubscriptionStatus(phone)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:4000/pay-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan, phone }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        setError(data.error || "Unknown error. Please try again.")
      }
    } catch (err) {
      setLoading(false)
      setError("Network error. Please try again.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 dark:bg-black py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Subscribe with Mobile Money</h1>
        <form onSubmit={handleSubscribe} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              id="phone"
              type="tel"
              pattern="^07[0-9]{8}$"
              placeholder="07XX XXX XXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter your MTN or Airtel number (Uganda only)</p>
          </div>
          {statusLoading && <div className="text-sm text-gray-500">Checking subscription status...</div>}
          {statusError && <div className="text-red-600 text-sm">{statusError}</div>}
          {status && status.active ? (
            <div className="text-green-600 text-center text-sm">
              You have an active subscription: <b>{status.plan}</b><br />
              Expires: {new Date(status.expires!).toLocaleString()}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="plan" className="block text-sm font-medium mb-1">Select Plan</label>
                <select
                  id="plan"
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PLANS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (UGX {p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {typeof error === 'string' ? error : (error.message || JSON.stringify(error))}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay with Mobile Money"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
