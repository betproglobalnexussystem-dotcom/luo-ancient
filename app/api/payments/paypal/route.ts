import { NextRequest, NextResponse } from 'next/server'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  const data = await response.json()
  return data.access_token
}

// Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, reference } = body

    // Validate required fields
    if (!amount || !currency || !reference) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if PayPal credentials are configured
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'PayPal service not configured' },
        { status: 500 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: reference,
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: description || 'Payment for Linda Fashions'
        }
      ],
      application_context: {
        brand_name: 'Linda Fashions',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`
      }
    }

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': reference
      },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message || 'PayPal order creation failed',
          error: result
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'PayPal order created successfully',
      data: {
        order_id: result.id,
        reference: reference,
        amount: amount,
        currency: currency,
        status: 'pending',
        approval_url: result.links?.find((link: any) => link.rel === 'approve')?.href
      }
    })

  } catch (error) {
    console.error('PayPal payment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Capture PayPal payment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${order_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message || 'PayPal payment capture failed',
          error: result
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment captured successfully',
      data: {
        order_id: result.id,
        status: result.status,
        amount: result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
        currency: result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code
      }
    })

  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}








