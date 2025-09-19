"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, X, CreditCard, Calendar, Users, Download, Shield, Zap, Crown } from "lucide-react"
import Link from "next/link"

const subscriptionPlans = [
  {
    id: "2days",
    name: "2 Days Access",
    price: 5000,
    currency: "UGX",
    duration: "2 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Basic support"
    ],
    limitations: [
      "No offline downloads",
      "No priority support",
      "No family sharing"
    ],
    bestFor: "Quick viewing",
    icon: Calendar
  },
  {
    id: "1week",
    name: "1 Week Access",
    price: 10000,
    currency: "UGX",
    duration: "7 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Email support"
    ],
    limitations: [
      "No priority support",
      "No family sharing",
      "Limited to 2 devices"
    ],
    bestFor: "Weekend binge",
    icon: Calendar
  },
  {
    id: "2weeks",
    name: "2 Weeks Access",
    price: 17000,
    currency: "UGX",
    duration: "14 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Priority support",
      "Up to 3 devices"
    ],
    limitations: [
      "No family sharing",
      "No early access"
    ],
    bestFor: "Extended viewing",
    icon: Star
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
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Priority support",
      "Early access to new releases",
      "Up to 3 devices"
    ],
    limitations: [
      "No family sharing"
    ],
    bestFor: "Regular viewing",
    icon: Crown
  },
  {
    id: "3months",
    name: "3 Months Access",
    price: 70000,
    currency: "UGX",
    duration: "90 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Priority support",
      "Early access to new releases",
      "Family sharing (3 devices)",
      "Exclusive content preview"
    ],
    limitations: [],
    bestFor: "Family viewing",
    icon: Users
  },
  {
    id: "6months",
    name: "6 Months Access",
    price: 120000,
    currency: "UGX",
    duration: "180 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Priority support",
      "Early access to new releases",
      "Family sharing (5 devices)",
      "Exclusive content",
      "Premium support"
    ],
    limitations: [],
    bestFor: "Long-term commitment",
    icon: Shield
  },
  {
    id: "1year",
    name: "1 Year Access",
    price: 200000,
    currency: "UGX",
    duration: "365 Days",
    features: [
      "Access to all movies",
      "HD Quality streaming",
      "Mobile & Desktop access",
      "Download for offline viewing",
      "Priority support",
      "Early access to new releases",
      "Family sharing (5 devices)",
      "Exclusive content",
      "Annual bonus content",
      "VIP support",
      "Special events access"
    ],
    limitations: [],
    bestFor: "Ultimate experience",
    icon: Zap
  }
]

const features = [
  {
    icon: Download,
    title: "Offline Downloads",
    description: "Download movies and series to watch without internet"
  },
  {
    icon: Users,
    title: "Family Sharing",
    description: "Share your subscription with family members"
  },
  {
    icon: Shield,
    title: "HD Quality",
    description: "Watch in high definition on all devices"
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Get new releases before they're available to everyone"
  }
]

const billingInfo = [
  {
    title: "Payment Methods",
    description: "We accept all major payment methods",
    details: ["Mobile Money", "Bank Transfer", "Credit/Debit Cards", "PayPal"]
  },
  {
    title: "Billing Cycle",
    description: "Choose from flexible billing options",
    details: ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"]
  },
  {
    title: "Cancellation",
    description: "Cancel anytime with no penalties",
    details: ["No cancellation fees", "Keep access until period ends", "Easy cancellation process", "Refund policy available"]
  },
  {
    title: "Auto-Renewal",
    description: "Convenient automatic renewal",
    details: ["Automatic billing", "Email notifications", "Easy to disable", "No surprise charges"]
  }
]

export default function SubscriptionPlansPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your viewing needs. All plans include access to our complete library.
        </p>
      </div>

      {/* Features Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">What's Included</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">MOST POPULAR</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <plan.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">{plan.price.toLocaleString()} {plan.currency}</span>
                  <span className="text-sm"> / {plan.duration}</span>
                </CardDescription>
                <Badge variant="outline" className="w-fit mx-auto">{plan.bestFor}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Included Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <X className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="sm"
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Billing Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {billingInfo.map((info, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{info.title}</CardTitle>
                <CardDescription>{info.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {info.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Plan Comparison */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">Plan Comparison</CardTitle>
          <CardDescription className="text-center">
            Compare features across all subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  {subscriptionPlans.map((plan) => (
                    <th key={plan.id} className="text-center p-2 min-w-[120px]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">HD Quality</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center p-2">
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Offline Downloads</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center p-2">
                      {plan.features.includes("Download for offline viewing") ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Family Sharing</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center p-2">
                      {plan.features.some(f => f.includes("Family sharing")) ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Early Access</td>
                  {subscriptionPlans.map((plan) => (
                    <td key={plan.id} className="text-center p-2">
                      {plan.features.includes("Early access to new releases") ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Choose your plan and start enjoying unlimited access to Luo Ancient Movies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/subscription">
            <Button size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              View All Plans
            </Button>
          </Link>
          <Link href="/help/contact">
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>

      {/* Back to Help */}
      <div className="mt-8 text-center">
        <Link href="/help">
          <Button variant="outline">
            ← Back to Help Center
          </Button>
        </Link>
      </div>
    </div>
  )
}






