import { NextRequest, NextResponse } from 'next/server'

const RELWORX_API_URL = 'https://payments.relworx.com/api/mobile-money/request-payment'
const RELWORX_API_KEY = process.env.RELWORX_API_KEY
const RELWORX_ACCOUNT_NO = process.env.RELWORX_ACCOUNT_NO

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { msisdn, amount, currency, description, reference } = body

    // Validate required fields
    if (!msisdn || !amount || !currency || !reference) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone number format (should start with +)
    if (!msisdn.startsWith('+')) {
      return NextResponse.json(
        { success: false, message: 'Phone number must be internationally formatted (e.g., +256701345678)' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate currency
    const supportedCurrencies = ['UGX', 'KES', 'TZS']
    if (!supportedCurrencies.includes(currency)) {
      return NextResponse.json(
        { success: false, message: 'Unsupported currency. Supported: UGX, KES, TZS' },
        { status: 400 }
      )
    }

    // Check if API credentials are configured
    if (!RELWORX_API_KEY || !RELWORX_ACCOUNT_NO) {
      return NextResponse.json(
        { success: false, message: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Prepare payment request
    const paymentData = {
      account_no: RELWORX_ACCOUNT_NO,
      reference: reference,
      msisdn: msisdn,
      currency: currency,
      amount: parseFloat(amount),
      description: description || 'Payment for Linda Fashions'
    }

    // Make request to Relworx API
    const response = await fetch(RELWORX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.relworx.v2',
        'Authorization': `Bearer ${RELWORX_API_KEY}`
      },
      body: JSON.stringify(paymentData)
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message || 'Payment request failed',
          error: result
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment request sent successfully',
      data: {
        internal_reference: result.internal_reference,
        reference: reference,
        amount: amount,
        currency: currency,
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('Relworx payment error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}








