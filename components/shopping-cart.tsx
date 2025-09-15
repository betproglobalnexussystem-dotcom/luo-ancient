"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useTheme } from "next-themes"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ShoppingCartProps {
  open: boolean
  onClose: () => void
}

export function ShoppingCart({ open, onClose }: ShoppingCartProps) {
  const { theme } = useTheme()
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"method" | "details" | "processing" | "complete">("method")
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "airtel" | "cash" | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [address, setAddress] = useState("")
  const [contactPhone, setContactPhone] = useState("")

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

  const validateForm = () => {
    if (!fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name",
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

    if (!contactPhone.trim() || !/^07\d{8}$/.test(contactPhone.replace(/\s/g, ""))) {
      toast({
        title: "Valid phone number required",
        description: "Please enter a valid phone number (e.g., 07XX XXX XXX)",
        variant: "destructive",
      })
      return false
    }

    if (
      (paymentMethod === "mtn" || paymentMethod === "airtel") &&
      (!phoneNumber.trim() || !/^07\d{8}$/.test(phoneNumber.replace(/\s/g, "")))
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

  const handlePaymentSubmit = () => {
    if (!validateForm()) return

    setPaymentStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep("complete")

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
        deliveryAddress: address,
        contactPhone,
      }

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]))

      toast({
        title: "Payment successful!",
        description: `Your order #${orderId} has been placed successfully.`,
      })

      // Clear cart after successful payment
      setTimeout(() => {
        clearCart()
        onClose()
        router.push(`/order-confirmation/${orderId}`)
      }, 2000)
    }, 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-[400px] h-full transition-transform",
          theme === "dark" ? "bg-card text-card-foreground" : "bg-white",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="font-semibold text-lg">Shopping Cart ({items.length})</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {isCheckingOut ? (
            <div className="flex-1 p-6">
              {paymentStep === "method" && (
                <>
                  <Button variant="outline" size="sm" className="mb-4" onClick={() => setIsCheckingOut(false)}>
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Cart
                  </Button>

                  <h3 className="font-semibold text-lg mb-4">Payment Method</h3>

                  <RadioGroup value={paymentMethod || ""} onValueChange={(value) => setPaymentMethod(value as any)}>
                    <div className="space-y-4">
                      <div
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          paymentMethod === "mtn" ? "border-primary bg-primary/5" : "hover:border-primary",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="mtn" id="mtn" className="mt-0" />
                          <div className="relative h-12 w-20">
                            <Image
                              src="/images/mtn-logo-official.png"
                              alt="MTN Mobile Money"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mtn" className="font-medium">
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
                          <RadioGroupItem value="airtel" id="airtel" className="mt-0" />
                          <div className="relative h-12 w-20">
                            <Image
                              src="/images/airtel-money-official.png"
                              alt="Airtel Money"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="airtel" className="font-medium">
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
                          <RadioGroupItem value="cash" id="cash" className="mt-0" />
                          <div className="relative h-10 w-10">
                            <Image
                              src="/images/cash-delivery-icon.png"
                              alt="Cash on Delivery"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cash" className="font-medium">
                              Cash on Delivery
                            </Label>
                            <p className="text-sm text-muted-foreground">Pay when you receive your items</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6">
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!paymentMethod}
                      onClick={() => setPaymentStep("details")}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {paymentStep === "details" && (
                <>
                  <Button variant="outline" size="sm" className="mb-4" onClick={() => setPaymentStep("method")}>
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Payment Methods
                  </Button>

                  <h3 className="font-semibold text-lg mb-4">
                    {paymentMethod === "mtn" && "MTN Mobile Money"}
                    {paymentMethod === "airtel" && "Airtel Money"}
                    {paymentMethod === "cash" && "Delivery Details"}
                  </h3>

                  <div className="space-y-4">
                    {(paymentMethod === "mtn" || paymentMethod === "airtel") && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Mobile Money Number</Label>
                          <Input
                            id="phone"
                            placeholder="07XX XXX XXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="p-3 bg-primary/10 rounded-md text-sm">
                          You will receive a prompt on your phone to complete the payment of {formatUGX(total)}.
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        placeholder="Your delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="07XX XXX XXX"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full" size="lg" onClick={handlePaymentSubmit}>
                      {paymentMethod === "cash" ? "Complete Order" : "Pay Now"}
                    </Button>
                  </div>
                </>
              )}

              {paymentStep === "processing" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                  <h3 className="font-semibold text-lg mb-2">Processing Payment</h3>
                  <p className="text-muted-foreground text-center">Please wait while we process your payment...</p>
                </div>
              )}

              {paymentStep === "complete" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground text-center mb-4">Your order has been placed successfully.</p>
                  <p className="font-medium mb-6">Order Total: {formatUGX(total)}</p>
                  <Button onClick={onClose}>Continue Shopping</Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {items.length > 0 ? (
                <ScrollArea className="flex-1">
                  <div className="px-6 py-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4 border-b">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-medium">{formatUGX(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4 text-center">
                    Add items to your cart to continue shopping
                  </p>
                  <Button onClick={onClose}>Continue Shopping</Button>
                </div>
              )}

              {/* Cart Summary */}
              {items.length > 0 && (
                <div className="border-t p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatUGX(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : formatUGX(shipping)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatUGX(total)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="lg" onClick={() => setIsCheckingOut(true)}>
                    Checkout
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
