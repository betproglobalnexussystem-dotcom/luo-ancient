import { NextRequest, NextResponse } from 'next/server'

const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3'
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET

let cachedToken: { token: string; expiry: number } | null = null

async function getAccessToken() {
  if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
    throw new Error('Pesapal credentials not configured')
  }
  const now = Date.now()
  if (cachedToken && cachedToken.expiry > now + 60_000) {
    return cachedToken.token
  }
  const res = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consumer_key: PESAPAL_CONSUMER_KEY, consumer_secret: PESAPAL_CONSUMER_SECRET })
  })
  const data = await res.json()
  if (!res.ok || !data.token) {
    throw new Error(data.message || 'Failed to get Pesapal token')
  }
  // Pesapal returns expiry in seconds (typically) via expiry_date or expires_in; handle both
  const expiresInMs = data.expires_in ? Number(data.expires_in) * 1000 : 55 * 60 * 1000
  cachedToken = { token: data.token, expiry: Date.now() + expiresInMs }
  return data.token
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, description, reference, callbackUrl } = await req.json()
    if (!amount || !currency || !reference) {
      return NextResponse.json({ success: false, message: 'amount, currency, and reference are required' }, { status: 400 })
    }
    const token = await getAccessToken()
    const orderPayload = {
      id: reference,
      currency: currency,
      amount: Number(amount),
      description: description || 'Subscription Payment',
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
      notification_id: '',
    }
    const res = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload)
    })
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ success: false, message: data.message || 'Failed to create order', error: data }, { status: 400 })
    }
    // Expect redirect_url or order_tracking_id
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Pesapal error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 })
  }
}





