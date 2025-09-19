"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { movieService, seriesService, type Movie, type Series } from "@/lib/firebase-services"

interface ContinueWatchingItem {
  id: string
  movieId: string
  movieTitle: string
  moviePoster: string
  watchedAt: string
  progress: number
  duration: number
  type: "movie" | "series"
  seasonNumber?: number
  episodeNumber?: number
}

export default function ContinueWatchingPage() {
  const [continueWatchingItems, setContinueWatchingItems] = useState<ContinueWatchingItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load watch history and filter for incomplete items
    const savedWatchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")

    // Filter for items that are not completed (less than 90% watched) and sort by most recent
    const incompleteItems = savedWatchHistory
      .filter((item: ContinueWatchingItem) => item.progress < item.duration * 0.9 && item.progress > 0)
      .sort(
        (a: ContinueWatchingItem, b: ContinueWatchingItem) =>
          new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime(),
      )
      .slice(0, 12) // Limit to 12 most recent items

    // Add sample data if none exists
    if (incompleteItems.length === 0) {
      const sampleItems: ContinueWatchingItem[] = [
        {
          id: "cw1",
          movieId: "1",
          movieTitle: "Ancient Warriors",
          moviePoster: "/ancient-warriors-movie-poster.jpg",
          watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          progress: 3600, // 1 hour watched
          duration: 8100, // 2h 15m total
          type: "movie",
        },
        {
          id: "cw2",
          movieId: "s1",
          movieTitle: "Legends of the Lake - S1E3",
          moviePoster: "/lake-legends-movie-poster.jpg",
          watchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          progress: 1800, // 30 minutes watched
          duration: 2700, // 45 minutes total
          type: "series",
          seasonNumber: 1,
          episodeNumber: 3,
        },
        {
          id: "cw3",
          movieId: "3",
          movieTitle: "River of Spirits",
          moviePoster: "/placeholder.svg?key=spirits",
          watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          progress: 4200, // 70 minutes watched
          duration: 6900, // 1h 55m total
          type: "movie",
        },
      ]
      setContinueWatchingItems(sampleItems)
      // Don't save sample data to localStorage to avoid overwriting real data
    } else {
      setContinueWatchingItems(incompleteItems)
    }

    setLoading(false)
  }, [user, router])

  const handleContinueWatching = (item: ContinueWatchingItem) => {
    if (item.type === "movie") {
      router.push(`/movie/${item.movieId}`)
    } else {
      router.push(`/series/${item.movieId}/season/${item.seasonNumber}/episode/${item.episodeNumber}`)
    }
  }

  const removeFromContinueWatching = (id: string) => {
    // Remove from continue watching by marking as completed in watch history
    const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")
    const updatedHistory = watchHistory.map((item: ContinueWatchingItem) =>
      item.id === id ? { ...item, progress: item.duration } : item,
    )
    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory))

    // Update local state
    setContinueWatchingItems((prev) => prev.filter((item) => item.id !== id))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getProgressPercentage = (progress: number, duration: number) => {
    return Math.min(Math.round((progress / duration) * 100), 100)
  }

  const getTimeRemaining = (progress: number, duration: number) => {
    const remaining = duration - progress
    return formatTime(remaining)
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Continue Watching</h1>
            <p className="text-muted-foreground">
              Pick up where you left off with {continueWatchingItems.length}{" "}
              {continueWatchingItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : continueWatchingItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {continueWatchingItems.map((item) => (
                <div key={item.id} className="glass dark:glass-dark rounded-xl overflow-hidden group relative">
                  <div className="relative aspect-video">
                    <Image
                      src={item.moviePoster || "/placeholder.svg"}
                      alt={item.movieTitle}
                      fill
                      className="object-cover"
                    />

                    {/* Progress Bar Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${getProgressPercentage(item.progress, item.duration)}%` }}
                      ></div>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="lg" onClick={() => handleContinueWatching(item)} className="rounded-full">
                        <Play className="h-6 w-6 mr-2" />
                        Continue
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromContinueWatching(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {/* Progress Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {getProgressPercentage(item.progress, item.duration)}%
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">{item.movieTitle}</h3>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{getTimeRemaining(item.progress, item.duration)} left</span>
                      <span>{formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}</span>
                    </div>

                    <Button className="w-full" onClick={() => handleContinueWatching(item)}>
                      <Play className="h-4 w-4 mr-2" />
                      Continue Watching
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass dark:glass-dark rounded-xl p-12 text-center">
              <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Nothing to continue</h2>
              <p className="text-muted-foreground mb-8">
                Start watching movies and series to see them here when you want to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/movies">Browse Movies</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/series">Browse Series</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {continueWatchingItems.length > 0 && (
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold mb-4">Looking for something new?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/movies">Browse Movies</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/series">Browse Series</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/watch-history">View Full History</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
