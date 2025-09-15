"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  productCode?: string
  isNew?: boolean
  isFeatured?: boolean
  className?: string
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  productCode,
  isNew = false,
  isFeatured = false,
  className,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const inWishlist = isInWishlist(id)

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id,
      name,
      price,
      image,
      category,
      productCode,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        category,
        productCode,
      })
    }
  }

  return (
    <Link href={`/product/${id}`}>
      <div
        className={cn(
          "product-card group relative rounded-xl overflow-hidden h-full flex flex-col",
          "dark:glass-dark glass",
          className,
        )}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 rounded-full bg-background/50 backdrop-blur-sm z-10",
              inWishlist && "text-red-500 hover:text-red-600",
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </Button>

          {isNew && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
              New
            </span>
          )}

          {discount > 0 && (
            <span className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full z-10">
              {discount}% OFF
            </span>
          )}

          {productCode && (
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full z-10">
              {productCode}
            </span>
          )}
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>

          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{category}</p>

          <div className="flex items-center gap-2 mt-auto">
            <span className="font-semibold text-sm">{formatUGX(price)}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatUGX(originalPrice)}</span>
            )}
          </div>

          <Button
            size="sm"
            className="w-full mt-2 rounded-full text-xs h-8 flex items-center gap-1"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-3 w-3" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}
