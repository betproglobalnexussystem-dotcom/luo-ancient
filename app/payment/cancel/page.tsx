"use client"

import { SiteLogo } from "@/components/site-logo"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-8">
            <SiteLogo />
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
              <CardDescription>
                Your payment was cancelled. No charges were made to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>You can try again or choose a different payment method.</p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button onClick={() => router.push('/subscription')} className="w-full">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                  Continue Shopping
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







