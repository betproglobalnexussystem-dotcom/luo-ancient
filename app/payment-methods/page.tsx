
"use client"
import React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CreditCard, Plus, Trash2, Check, Phone } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentMethod {
  id: string
  type: "mtn" | "airtel" | "paypal"
  phoneNumber?: string
  email?: string
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "mtn", phoneNumber: "0772123456", isDefault: true },
    { id: "2", type: "airtel", phoneNumber: "0700987654", isDefault: false },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState<"mtn" | "airtel" | "paypal">("mtn")
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [newEmail, setNewEmail] = useState("")

  // Only redirect on client
  React.useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])
  if (!user) {
    return null
  }

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPaymentType === "paypal") {
      if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid PayPal email address",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!newPhoneNumber.trim() || !/^07\d{8}$/.test(newPhoneNumber.replace(/\s/g, ""))) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number (e.g., 07XX XXX XXX)",
          variant: "destructive",
        })
        return
      }
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentType,
      phoneNumber: newPaymentType !== "paypal" ? newPhoneNumber : undefined,
      email: newPaymentType === "paypal" ? newEmail : undefined,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods([...paymentMethods, newMethod])
    setNewPhoneNumber("")
    setNewEmail("")
    setShowAddForm(false)

    toast({
      title: "Payment method added",
      description: `Your ${newPaymentType === "mtn" ? "MTN" : newPaymentType === "airtel" ? "Airtel" : "PayPal"} payment method has been added.`,
    })
  }

  const handleRemovePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find((method) => method.id === id)
    const updatedMethods = paymentMethods.filter((method) => method.id !== id)

    // If we're removing the default method, make the first remaining one the default
    if (methodToRemove?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true
    }

    setPaymentMethods(updatedMethods)

    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    })
  }

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedMethods)

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
          <p className="text-muted-foreground mb-8">Manage your payment methods</p>

          <div className="glass dark:glass-dark rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Payment Methods</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2"
              >
                {showAddForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add New
                  </>
                )}
              </Button>
            </div>

            {showAddForm && (
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-4">Add Payment Method</h3>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div className="space-y-3">
                    <Label>Payment Type</Label>
                    <RadioGroup
                      value={newPaymentType}
                      onValueChange={(value) => setNewPaymentType(value as "mtn" | "airtel" | "paypal")}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="mtn" id="mtn" />
                        <div className="relative h-10 w-16">
                          <Image
                            src="/images/mtn-logo-official.png"
                            alt="MTN Mobile Money"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Label htmlFor="mtn">MTN Mobile Money</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="airtel" id="airtel" />
                        <div className="relative h-10 w-16">
                          <Image
                            src="/images/airtel-money-official.png"
                            alt="Airtel Money"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <Label htmlFor="airtel">Airtel Money</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div className="relative h-10 w-16">
                          <Image src="/paypal-logo.png" alt="PayPal" fill className="object-contain" />
                        </div>
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {newPaymentType === "paypal" ? (
                    <div className="space-y-2">
                      <Label htmlFor="email">PayPal Email</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone-number"
                          placeholder="07XX XXX XXX"
                          className="pl-10"
                          value={newPhoneNumber}
                          onChange={(e) => setNewPhoneNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit">Add Payment Method</Button>
                </form>
              </div>
            )}

            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-20">
                        <Image
                          src={
                            method.type === "mtn"
                              ? "/images/mtn-logo-official.png"
                              : method.type === "airtel"
                                ? "/images/airtel-money-official.png"
                                : "/placeholder.svg?height=48&width=80&query=PayPal logo"
                          }
                          alt={
                            method.type === "mtn"
                              ? "MTN Mobile Money"
                              : method.type === "airtel"
                                ? "Airtel Money"
                                : "PayPal"
                          }
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type === "mtn"
                            ? "MTN Mobile Money"
                            : method.type === "airtel"
                              ? "Airtel Money"
                              : "PayPal"}
                          {method.isDefault && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{method.phoneNumber || method.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                <p className="text-muted-foreground mb-6">You haven't added any payment methods yet.</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
