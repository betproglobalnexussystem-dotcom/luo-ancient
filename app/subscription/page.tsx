"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { PaymentMethods } from "@/components/payment-methods"

const subscriptionPlans = [
  {
    id: "2days",
    name: "2 Days Access",
    price: 5000,
    currency: "UGX",
    duration: "2 Days",
    features: ["Access to all movies", "HD Quality", "Mobile & Desktop"],
  },
  {
    id: "1week",
    name: "1 Week Access",
    price: 10000,
    currency: "UGX",
    duration: "7 Days",
    features: ["Access to all movies", "HD Quality", "Mobile & Desktop", "Download for offline"],
  },
  {
    id: "2weeks",
    name: "2 Weeks Access",
    price: 17000,
    currency: "UGX",
    duration: "14 Days",
    features: ["Access to all movies", "HD Quality", "Mobile & Desktop", "Download for offline", "Priority support"],
  },
  {
    id: "1month",
    name: "1 Month Access",
    price: 30000,
    currency: "UGX",
    duration: "30 Days",
    popular: true,
    features: [
      "Access to all movies",
      "HD Quality",
      "Mobile & Desktop",
      "Download for offline",
      "Priority support",
      "Early access to new releases",
    ],
  },
  {
    id: "3months",
    name: "3 Months Access",
    price: 70000,
    currency: "UGX",
    duration: "90 Days",
    features: [
      "Access to all movies",
      "HD Quality",
      "Mobile & Desktop",
      "Download for offline",
      "Priority support",
      "Early access to new releases",
      "Family sharing (3 devices)",
    ],
  },
  {
    id: "6months",
    name: "6 Months Access",
    price: 120000,
    currency: "UGX",
    duration: "180 Days",
    features: [
      "Access to all movies",
      "HD Quality",
      "Mobile & Desktop",
      "Download for offline",
      "Priority support",
      "Early access to new releases",
      "Family sharing (5 devices)",
      "Exclusive content",
    ],
  },
  {
    id: "1year",
    name: "1 Year Access",
    price: 200000,
    currency: "UGX",
    duration: "365 Days",
    features: [
      "Access to all movies",
      "HD Quality",
      "Mobile & Desktop",
      "Download for offline",
      "Priority support",
      "Early access to new releases",
      "Family sharing (5 devices)",
      "Exclusive content",
      "Annual bonus content",
    ],
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (paymentData: any) => {
    const plan = subscriptionPlans.find((p) => p.id === selectedPlan)
    
    toast({
      title: "Subscription Successful",
      description: `Welcome to ${plan?.name}! Enjoy unlimited access.`,
    })
    
    setSelectedPlan(null)
    setShowPayment(false)
    
    // Redirect to content
    router.push("/movies")
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access to Luo Ancient Movies with our flexible subscription plans
        </p>
        <div className="mt-8 p-6 bg-primary/5 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Why Subscribe?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Unlimited access to all content</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>HD quality streaming</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Watch on any device</span>
            </div>
          </div>
        </div>
      </div>

      {user?.subscription && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Current Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{user.subscription.plan}</p>
                <p className="text-sm text-muted-foreground">
                  Expires: {user.subscription.expiresAt.toLocaleDateString()}
                </p>
              </div>
              <Badge variant={user.subscription.isActive ? "default" : "destructive"}>
                {user.subscription.isActive ? "Active" : "Expired"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Complete Payment</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowPayment(false)
                  setSelectedPlan(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedPlan && (
              <PaymentMethods
                amount={subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0}
                currency={subscriptionPlans.find(p => p.id === selectedPlan)?.currency || "UGX"}
                description={`Subscription: ${subscriptionPlans.find(p => p.id === selectedPlan)?.name}`}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">MOST POPULAR</Badge>
              </div>
            )}

            <CardHeader className="text-center p-3 md:p-6">
              <CardTitle className="text-sm md:text-lg">{plan.name}</CardTitle>
              <CardDescription className="mt-1">
                <span className="text-lg md:text-3xl font-bold text-foreground">{plan.price.toLocaleString()} {plan.currency}</span>
                <span className="text-xs md:text-sm"> / {plan.duration}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 md:space-y-4 p-3 md:p-6 pt-0">
              <ul className="space-y-1 md:space-y-2">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-1 md:space-x-2">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                    <span className="text-xs md:text-sm leading-tight">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li className="text-xs text-muted-foreground sm:hidden">
                    +{plan.features.length - 3} more features
                  </li>
                )}
                {plan.features.length > 3 && (
                  <div className="hidden sm:block">
                    {plan.features.slice(3).map((feature, index) => (
                      <li key={index + 3} className="flex items-center space-x-1 md:space-x-2">
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
                        <span className="text-xs md:text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </div>
                )}
              </ul>

              <Button
                className="w-full text-xs md:text-sm py-2 md:py-3"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={selectedPlan === plan.id}
              >
                {selectedPlan === plan.id ? "Processing..." : "Subscribe"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include access to our complete library of Luo Ancient Movies and Series. Cancel anytime. No hidden
          fees.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Contact: lightstarecord@gmail.com</span>
          <span>WhatsApp: 0789096965</span>
        </div>
      </div>
    </div>
  )
}
