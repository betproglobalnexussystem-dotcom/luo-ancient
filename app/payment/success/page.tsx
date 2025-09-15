"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SiteLogo } from "@/components/site-logo"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<any>(null)

  const orderId = searchParams.get('token')
  const paymentId = searchParams.get('paymentId')
  const payerId = searchParams.get('PayerID')

  useEffect(() => {
    if (orderId) {
      verifyPayPalPayment()
    } else {
      setIsVerifying(false)
    }
  }, [orderId])

  const verifyPayPalPayment = async () => {
    try {
      const response = await fetch('/api/payments/paypal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentStatus(result.data)
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully"
        })
      } else {
        toast({
          title: "Payment verification failed",
          description: result.message || "Failed to verify payment",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      toast({
        title: "Verification error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive"
      })
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="container max-w-md mx-auto">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
                <p className="text-muted-foreground text-center">
                  Please wait while we verify your payment...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-8">
            <SiteLogo />
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentStatus && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{paymentStatus.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{paymentStatus.currency} {paymentStatus.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-600 capitalize">{paymentStatus.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button onClick={() => router.push('/')} className="w-full">
                  Continue Shopping
                </Button>
                <Button onClick={() => router.push('/account')} variant="outline" className="w-full">
                  View Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}







