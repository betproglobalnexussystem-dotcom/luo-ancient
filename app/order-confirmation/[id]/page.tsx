"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Truck, Package, Clock, Calendar, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  status: string
  deliveryAddress: string
  contactPhone: string
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === params.id)
    setOrder(foundOrder || null)
    setLoading(false)
  }, [params.id])

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const orderDate = new Date(order.date)
  const estimatedDelivery = new Date(orderDate)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="glass dark:glass-dark rounded-xl p-6 md:p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center mb-2">Order Confirmed!</h1>
              <p className="text-center text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date Placed</p>
                  <p className="font-medium">
                    {orderDate.toLocaleDateString()} ({formatDistanceToNow(orderDate, { addSuffix: true })})
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">{formatUGX(order.total)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === "mtn" && "MTN Mobile Money"}
                    {order.paymentMethod === "airtel" && "Airtel Money"}
                    {order.paymentMethod === "cash" && "Cash on Delivery"}
                  </p>
                </div>
              </div>

              <div className="border-t border-b py-6 mb-6">
                <h2 className="font-semibold text-lg mb-4">Order Status</h2>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="relative flex items-start mb-6">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Order Placed</h3>
                      <p className="text-sm text-muted-foreground">
                        {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start mb-6">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Payment Confirmed</h3>
                      <p className="text-sm text-muted-foreground">
                        {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start mb-6">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center z-10">
                      <Package className="w-3 h-3 text-secondary-foreground" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Processing</h3>
                      <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center z-10">
                      <Truck className="w-3 h-3 text-secondary-foreground" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Estimated delivery by {estimatedDelivery.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-4">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-muted-foreground">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Contact Phone</p>
                      <p className="text-muted-foreground">{order.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-muted-foreground">{estimatedDelivery.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Delivery Time</p>
                      <p className="text-muted-foreground">Between 9:00 AM and 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatUGX(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatUGX(order.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatUGX(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatUGX(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
