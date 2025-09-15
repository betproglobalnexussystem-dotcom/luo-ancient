"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Play, Heart, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/hooks/use-auth"

interface MovieCardProps {
  id: string
  title: string
  year: number
  rating: number
  genre: string
  poster: string
  duration: string
  isNew?: boolean
  isPremium?: boolean
}

export function MovieCard({
  id,
  title,
  year,
  rating,
  genre,
  poster,
  duration,
  isNew = false,
  isPremium = false,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const inWishlist = isInWishlist(id)

  const hasAccess = !isPremium || (user?.subscription?.isActive && user.subscription.plan)
  const canWatch = hasAccess

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        id,
        title,
        year,
        rating,
        genre,
        poster,
        duration,
        type: "movie",
      })
    }
  }

  return (
    <div className="group relative">
      <Link href={canWatch ? `/movie/${id}` : "/subscription"} className="block">
        <div className="movie-card relative bg-card rounded-lg overflow-hidden shadow-md">
          {/* Poster Container - Only Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {!imageError ? (
              <Image
                src={poster || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {!canWatch && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Premium Content</p>
                  <p className="text-xs opacity-80">Subscribe to watch</p>
                </div>
              </div>
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex space-x-2">
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  {canWatch ? (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1" />
                      Subscribe
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={cn("w-4 h-4", inWishlist && "fill-current text-red-500")} />
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <Badge variant="destructive" className="text-xs">
                  NEW
                </Badge>
              )}
              {isPremium && <Badge className="text-xs bg-yellow-500 text-black">PREMIUM</Badge>}
            </div>

          </div>
        </div>
      </Link>
      
      {/* Title Below Poster */}
      <div className="mt-2 px-1">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </div>
  )
}
