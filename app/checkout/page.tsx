"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, CreditCard, MapPin, Phone, ShoppingBag, Truck, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [step, setStep] = useState<"shipping" | "payment" | "review" | "processing" | "complete">("shipping")

  // Shipping form state
  const [fullName, setFullName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Uganda")

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "airtel" | "cash" | null>(null)
  const [paymentPhone, setPaymentPhone] = useState("")

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 100000 ? 0 : 10000
  const total = subtotal + shipping

  const validateShippingForm = () => {
    if (!fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return false
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return false
    }

    if (!phone.trim() || !/^07\d{8}$/.test(phone.replace(/\s/g, ""))) {
      toast({
        title: "Valid phone number required",
        description: "Please enter a valid phone number (e.g., 07XX XXX XXX)",
        variant: "destructive",
      })
      return false
    }

    if (!address.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      })
      return false
    }

    if (!city.trim()) {
      toast({
        title: "City required",
        description: "Please enter your city",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const validatePaymentForm = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return false
    }

    if (
      (paymentMethod === "mtn" || paymentMethod === "airtel") &&
      (!paymentPhone.trim() || !/^07\d{8}$/.test(paymentPhone.replace(/\s/g, "")))
    ) {
      toast({
        title: "Valid payment phone number required",
        description: "Please enter a valid phone number for mobile money payment",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShippingForm()) {
      setStep("payment")
      window.scrollTo(0, 0)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePaymentForm()) {
      setStep("review")
      window.scrollTo(0, 0)
    }
  }

  const handlePlaceOrder = () => {
    setStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      setStep("complete")

      // Generate order ID
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

      // Save order to localStorage
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        status: "Processing",
        deliveryAddress: `${address}, ${city}, ${country}`,
        contactPhone: phone,
      }

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]))

      // Clear cart after successful payment
      clearCart()

      // Redirect to order confirmation page
      setTimeout(() => {
        router.push(`/order-confirmation/${orderId}`)
      }, 2000)
    }, 2000)
  }

  if (items.length === 0 && step !== "complete" && step !== "processing") {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add items to your cart to proceed with checkout.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">Complete your purchase</p>

          {/* Checkout Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "shipping" || step === "payment" || step === "review" || step === "processing" || step === "complete" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step === "shipping" ||
                  step === "payment" ||
                  step === "review" ||
                  step === "processing" ||
                  step === "complete" ? (
                    step === "shipping" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )
                  ) : (
                    "1"
                  )}
                </div>
                <span className="text-sm mt-1">Shipping</span>
              </div>

              <div className="w-16 h-0.5 bg-muted sm:w-32" />

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "payment" || step === "review" || step === "processing" || step === "complete" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step === "payment" || step === "review" || step === "processing" || step === "complete" ? (
                    step === "payment" ? (
                      <CreditCard className="h-5 w-5" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )
                  ) : (
                    "2"
                  )}
                </div>
                <span className="text-sm mt-1">Payment</span>
              </div>

              <div className="w-16 h-0.5 bg-muted sm:w-32" />

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "review" || step === "processing" || step === "complete" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {step === "review" || step === "processing" || step === "complete" ? (
                    step === "review" ? (
                      <ShoppingBag className="h-5 w-5" />
                    ) : (
                      <Check className="h-5 w-5" />
                    )
                  ) : (
                    "3"
                  )}
                </div>
                <span className="text-sm mt-1">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass dark:glass-dark rounded-xl p-6">
                {step === "shipping" && (
                  <form onSubmit={handleShippingSubmit}>
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07XX XXX XXX"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Continue to Payment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}

                {step === "payment" && (
                  <form onSubmit={handlePaymentSubmit}>
                    <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                    <RadioGroup
                      value={paymentMethod || ""}
                      onValueChange={(value) => setPaymentMethod(value as "mtn" | "airtel" | "cash")}
                      className="space-y-4 mb-6"
                    >
                      <div
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          paymentMethod === "mtn" ? "border-primary bg-primary/5" : "hover:border-primary",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="mtn" id="payment-mtn" className="mt-0" />
                          <div className="relative h-12 w-20">
                            <Image
                              src="/images/mtn-logo-official.png"
                              alt="MTN Mobile Money"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment-mtn" className="font-medium">
                              MTN Mobile Money
                            </Label>
                            <p className="text-sm text-muted-foreground">Pay with your MTN Mobile Money account</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          paymentMethod === "airtel" ? "border-primary bg-primary/5" : "hover:border-primary",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="airtel" id="payment-airtel" className="mt-0" />
                          <div className="relative h-12 w-20">
                            <Image
                              src="/images/airtel-money-official.png"
                              alt="Airtel Money"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment-airtel" className="font-medium">
                              Airtel Money
                            </Label>
                            <p className="text-sm text-muted-foreground">Pay with your Airtel Money account</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          paymentMethod === "cash" ? "border-primary bg-primary/5" : "hover:border-primary",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cash" id="payment-cash" className="mt-0" />
                          <div className="relative h-10 w-10">
                            <Image
                              src="/images/cash-delivery-icon.png"
                              alt="Cash on Delivery"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment-cash" className="font-medium">
                              Cash on Delivery
                            </Label>
                            <p className="text-sm text-muted-foreground">Pay when you receive your items</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
                      <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="paymentPhone">Mobile Money Number</Label>
                          <Input
                            id="paymentPhone"
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            placeholder="07XX XXX XXX"
                            required
                          />
                        </div>
                        <div className="p-3 bg-primary/10 rounded-md text-sm">
                          You will receive a prompt on your phone to complete the payment of {formatUGX(total)}.
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("shipping")}>
                        Back to Shipping
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue to Review
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}

                {step === "review" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

                    <div className="space-y-6 mb-6">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Shipping Address</h3>
                            <p className="text-sm text-muted-foreground">{fullName}</p>
                            <p className="text-sm text-muted-foreground">{address}</p>
                            <p className="text-sm text-muted-foreground">
                              {city}, {country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Contact Information</h3>
                            <p className="text-sm text-muted-foreground">{email}</p>
                            <p className="text-sm text-muted-foreground">{phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Payment Method</h3>
                            <div className="flex items-center mt-1">
                              {paymentMethod === "mtn" && (
                                <>
                                  <div className="relative h-8 w-16 mr-2">
                                    <Image
                                      src="/images/mtn-logo-official.png"
                                      alt="MTN Mobile Money"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <p className="text-sm">MTN Mobile Money ({paymentPhone})</p>
                                </>
                              )}
                              {paymentMethod === "airtel" && (
                                <>
                                  <div className="relative h-8 w-16 mr-2">
                                    <Image
                                      src="/images/airtel-money-official.png"
                                      alt="Airtel Money"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <p className="text-sm">Airtel Money ({paymentPhone})</p>
                                </>
                              )}
                              {paymentMethod === "cash" && (
                                <>
                                  <div className="relative h-8 w-8 mr-2">
                                    <Image
                                      src="/images/cash-delivery-icon.png"
                                      alt="Cash on Delivery"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <p className="text-sm">Cash on Delivery</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Shipping Method</h3>
                            <p className="text-sm text-muted-foreground">
                              {shipping === 0
                                ? "Free Shipping (3-5 business days)"
                                : "Standard Shipping (5-7 business days)"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h3 className="font-medium">Order Items</h3>
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatUGX(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("payment")}>
                        Back to Payment
                      </Button>
                      <Button type="button" className="flex-1" onClick={handlePlaceOrder}>
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}

                {step === "processing" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                    <h3 className="font-semibold text-lg mb-2">Processing Your Order</h3>
                    <p className="text-muted-foreground text-center">Please wait while we process your payment...</p>
                  </div>
                )}

                {step === "complete" && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Order Placed Successfully!</h3>
                    <p className="text-muted-foreground text-center mb-6">Thank you for your purchase.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="glass dark:glass-dark rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="font-medium">{formatUGX(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Shipping</p>
                    <p className="font-medium">{formatUGX(shipping)}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <p>Total</p>
                    <p>{formatUGX(total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
