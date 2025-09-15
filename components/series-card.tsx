"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Tv, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface SeriesCardProps {
  id: string
  title: string
  year: number
  rating: number
  genre: string
  poster: string
  seasons: number
  episodes: number
  isNew?: boolean
  isPremium?: boolean
}

export function SeriesCard({
  id,
  title,
  year,
  rating,
  genre,
  poster,
  seasons,
  episodes,
  isNew = false,
  isPremium = false,
}: SeriesCardProps) {
  const { user } = useAuth()

  const hasAccess = !isPremium || (user?.subscription?.isActive && user.subscription.plan)
  const canWatch = hasAccess

  return (
    <div className="group relative">
      <Link href={canWatch ? `/series/${id}` : "/subscription"} className="block">
        <div className="series-card relative bg-card rounded-lg overflow-hidden shadow-md">
          {/* Poster Container - Only Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={poster || "/placeholder.svg"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {isNew && <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">NEW</Badge>}
            {isPremium && <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-xs">PREMIUM</Badge>}

            {!canWatch && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white">
                  <Lock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">Premium Content</p>
                  <p className="text-xs opacity-80">Subscribe to watch</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
              <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                {canWatch ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
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
