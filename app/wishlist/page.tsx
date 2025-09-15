"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  productCode?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlistItems(savedWishlist)
    setLoading(false)
  }, [])

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
    setWishlistItems(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  const addToCart = (item: WishlistItem) => {
    addItem(item)

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.setItem("wishlist", "[]")

    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    })
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground mb-8">You need to be logged in to view your wishlist.</p>
            <Button asChild>
              <Link href="/login">Login</Link>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearWishlist}>
                Clear Wishlist
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="glass dark:glass-dark rounded-xl overflow-hidden group">
                  <div className="relative aspect-square">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-full"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <Button size="sm" className="rounded-full" onClick={() => addToCart(item)}>
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-medium mb-1">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{formatUGX(item.price)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass dark:glass-dark rounded-xl p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
