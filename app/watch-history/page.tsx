"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Search, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface WatchHistoryItem {
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

export default function WatchHistoryPage() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load watch history from localStorage
    const savedWatchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")

    // Add sample data if none exists
    if (savedWatchHistory.length === 0) {
      const sampleHistory: WatchHistoryItem[] = [
        {
          id: "wh1",
          movieId: "1",
          movieTitle: "Ancient Warriors",
          moviePoster: "/ancient-warriors-movie-poster.jpg",
          watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          progress: 3600, // 1 hour watched
          duration: 8100, // 2h 15m total
          type: "movie",
        },
        {
          id: "wh2",
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
          id: "wh3",
          movieId: "2",
          movieTitle: "The Drum Keeper",
          moviePoster: "/placeholder.svg?key=drum",
          watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          progress: 7500, // Completed
          duration: 7500, // 2h 5m total
          type: "movie",
        },
        {
          id: "wh4",
          movieId: "s1",
          movieTitle: "Legends of the Lake - S1E1",
          moviePoster: "/lake-legends-movie-poster.jpg",
          watchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          progress: 2700, // Completed
          duration: 2700, // 45 minutes total
          type: "series",
          seasonNumber: 1,
          episodeNumber: 1,
        },
      ]
      setWatchHistory(sampleHistory)
      localStorage.setItem("watchHistory", JSON.stringify(sampleHistory))
    } else {
      setWatchHistory(savedWatchHistory)
    }

    setLoading(false)
  }, [user, router])

  const filteredHistory = watchHistory
    .filter((item) => {
      const matchesSearch = item.movieTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab =
        selectedTab === "all" ||
        (selectedTab === "movies" && item.type === "movie") ||
        (selectedTab === "series" && item.type === "series") ||
        (selectedTab === "completed" && item.progress >= item.duration * 0.9) ||
        (selectedTab === "in-progress" && item.progress < item.duration * 0.9)
      return matchesSearch && matchesTab
    })
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())

  const handleContinueWatching = (item: WatchHistoryItem) => {
    if (item.type === "movie") {
      router.push(`/movie/${item.movieId}`)
    } else {
      router.push(`/series/${item.movieId}/season/${item.seasonNumber}/episode/${item.episodeNumber}`)
    }
  }

  const removeFromHistory = (id: string) => {
    const updatedHistory = watchHistory.filter((item) => item.id !== id)
    setWatchHistory(updatedHistory)
    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory))
  }

  const clearHistory = () => {
    setWatchHistory([])
    localStorage.setItem("watchHistory", "[]")
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

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Watch History</h1>
              <p className="text-muted-foreground">
                {filteredHistory.length} {filteredHistory.length === 1 ? "item" : "items"} in your history
              </p>
            </div>

            {watchHistory.length > 0 && (
              <Button variant="outline" onClick={clearHistory}>
                Clear All History
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your watch history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({watchHistory.length})</TabsTrigger>
              <TabsTrigger value="movies">Movies ({watchHistory.filter((h) => h.type === "movie").length})</TabsTrigger>
              <TabsTrigger value="series">
                Series ({watchHistory.filter((h) => h.type === "series").length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({watchHistory.filter((h) => h.progress < h.duration * 0.9).length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({watchHistory.filter((h) => h.progress >= h.duration * 0.9).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredHistory.length > 0 ? (
                <div className="space-y-4">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="glass dark:glass-dark rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.moviePoster || "/placeholder.svg"}
                            alt={item.movieTitle}
                            fill
                            className="object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => handleContinueWatching(item)}
                          >
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg mb-1">{item.movieTitle}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {formatTime(item.progress)} / {formatTime(item.duration)}
                                  </span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${getProgressPercentage(item.progress, item.duration)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {getProgressPercentage(item.progress, item.duration)}% complete
                              </p>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {item.progress < item.duration * 0.9 && (
                                <Button
                                  size="sm"
                                  onClick={() => handleContinueWatching(item)}
                                  className="flex items-center gap-2"
                                >
                                  <Play className="h-4 w-4" />
                                  Continue
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromHistory(item.id)}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchQuery ? "No matching history found" : "No watch history yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms or filters."
                      : "Start watching movies and series to build your history."}
                  </p>
                  <Button asChild>
                    <Link href="/movies">Browse Movies</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
