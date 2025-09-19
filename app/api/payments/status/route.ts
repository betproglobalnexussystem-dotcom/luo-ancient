import { NextRequest, NextResponse } from 'next/server'

const RELWORX_API_URL = 'https://payments.relworx.com/api/mobile-money/payment-status'
const RELWORX_API_KEY = process.env.RELWORX_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const type = searchParams.get('type') // 'relworx' or 'paypal'

    if (!reference || !type) {
      return NextResponse.json(
        { success: false, message: 'Reference and type are required' },
        { status: 400 }
      )
    }

    if (type === 'relworx') {
      // Check Relworx payment status
      if (!RELWORX_API_KEY) {
        return NextResponse.json(
          { success: false, message: 'Relworx service not configured' },
          { status: 500 }
        )
      }

      const response = await fetch(`${RELWORX_API_URL}?reference=${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RELWORX_API_KEY}`,
          'Accept': 'application/vnd.relworx.v2'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false, 
            message: result.message || 'Failed to check payment status',
            error: result
          },
          { status: response.status }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          reference: reference,
          status: result.status || 'pending',
          amount: result.amount,
          currency: result.currency,
          transaction_id: result.transaction_id
        }
      })
    }

    if (type === 'paypal') {
      // For PayPal, we would typically store the order status in our database
      // For now, return a mock response
      return NextResponse.json({
        success: true,
        data: {
          reference: reference,
          status: 'completed', // This would be fetched from your database
          amount: null,
          currency: null,
          transaction_id: reference
        }
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid payment type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}








