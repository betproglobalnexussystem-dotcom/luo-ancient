"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Smartphone, CreditCard, Loader2 } from "lucide-react"

interface PaymentMethodsProps {
  amount: number
  currency?: string
  description?: string
  onPaymentSuccess?: (data: any) => void
  onPaymentError?: (error: string) => void
}

export function PaymentMethods({ 
  amount, 
  currency = "UGX", 
  description = "Payment for Linda Fashions",
  onPaymentSuccess,
  onPaymentError 
}: PaymentMethodsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("mobile")
  const { toast } = useToast()

  // Mobile money form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState(currency)

  // PayPal form state
  const [paypalEmail, setPaypalEmail] = useState("")

  const generateReference = () => {
    return `LF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleMobilePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      })
      return
    }

    if (!phoneNumber.startsWith('+')) {
      toast({
        title: "Invalid phone number",
        description: "Phone number must start with country code (e.g., +256)",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    const reference = generateReference()

    try {
      const response = await fetch('/api/payments/relworx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          msisdn: phoneNumber,
          amount: amount,
          currency: selectedCurrency,
          description: description,
          reference: reference
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Payment request sent",
          description: "Please check your phone and approve the payment"
        })
        
        // Start polling for payment status
        pollPaymentStatus(reference, 'relworx')
        
        onPaymentSuccess?.(result.data)
      } else {
        toast({
          title: "Payment failed",
          description: result.message || "Failed to process payment",
          variant: "destructive"
        })
        onPaymentError?.(result.message)
      }
    } catch (error) {
      console.error('Mobile payment error:', error)
      toast({
        title: "Payment error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      })
      onPaymentError?.("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayPalPayment = async () => {
    setIsLoading(true)
    const reference = generateReference()

    try {
      const response = await fetch('/api/payments/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: selectedCurrency,
          description: description,
          reference: reference
        })
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to PayPal
        window.location.href = result.data.approval_url
      } else {
        toast({
          title: "PayPal payment failed",
          description: result.message || "Failed to create PayPal order",
          variant: "destructive"
        })
        onPaymentError?.(result.message)
      }
    } catch (error) {
      console.error('PayPal payment error:', error)
      toast({
        title: "Payment error",
        description: "Failed to process PayPal payment. Please try again.",
        variant: "destructive"
      })
      onPaymentError?.("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePesapalPayment = async () => {
    setIsLoading(true)
    const reference = generateReference()

    try {
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: selectedCurrency,
          description: description,
          reference: reference,
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`
        })
      })

      const result = await response.json()

      if (result.success) {
        // Pesapal returns redirect_url or payment URL within data
        const redirectUrl = result.data.redirect_url || result.data.redirecturl || result.data.payment_url
        if (redirectUrl) {
          window.location.href = redirectUrl
          return
        }
        onPaymentError?.('Missing redirect URL from Pesapal')
      } else {
        toast({ title: 'PesaPal payment failed', description: result.message || 'Failed to create order', variant: 'destructive' })
        onPaymentError?.(result.message)
      }
    } catch (error) {
      console.error('Pesapal payment error:', error)
      toast({ title: 'Payment error', description: 'Failed to process PesaPal payment. Please try again.', variant: 'destructive' })
      onPaymentError?.('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const pollPaymentStatus = async (reference: string, type: string) => {
    const maxAttempts = 30 // 5 minutes with 10-second intervals
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/payments/status?reference=${reference}&type=${type}`)
        const result = await response.json()

        if (result.success && result.data.status === 'completed') {
          toast({
            title: "Payment successful",
            description: "Your payment has been processed successfully"
          })
          onPaymentSuccess?.(result.data)
          return
        }

        if (result.success && result.data.status === 'failed') {
          toast({
            title: "Payment failed",
            description: "Your payment was not successful",
            variant: "destructive"
          })
          onPaymentError?.("Payment failed")
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else {
          toast({
            title: "Payment timeout",
            description: "Payment verification timed out. Please contact support.",
            variant: "destructive"
          })
          onPaymentError?.("Payment timeout")
        }
      } catch (error) {
        console.error('Payment status check error:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        }
      }
    }

    // Start polling after 5 seconds
    setTimeout(poll, 5000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Choose Payment Method</CardTitle>
        <CardDescription className="text-center">
          Pay {selectedCurrency} {amount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Money
            </TabsTrigger>
            <TabsTrigger value="paypal" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              PayPal
            </TabsTrigger>
            <TabsTrigger value="pesapal" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              PesaPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+256701345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your phone number with country code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                  <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                  <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleMobilePayment} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Pay with Mobile Money
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="paypal" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You'll be redirected to PayPal to complete payment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypal-currency">Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handlePayPalPayment} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with PayPal
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="pesapal" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">You will be redirected to PesaPal to complete payment.</p>
            </div>
            <Button 
              onClick={handlePesapalPayment} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with PesaPal
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}








