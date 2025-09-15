"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Play, Clock, CheckCircle, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { Input } from "@/components/ui/input"

interface Subscription {
  id: string
  planName: string
  duration: string
  price: number
  startDate: string
  endDate: string
  status: "Active" | "Expired" | "Cancelled"
  moviesWatched: number
  totalMovies: number
}

interface WatchHistory {
  id: string
  movieId: string
  movieTitle: string
  moviePoster: string
  watchedAt: string
  progress: number
  duration: number
}

export default function OrdersPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const savedSubscriptions = JSON.parse(localStorage.getItem("subscriptions") || "[]")
    const savedWatchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")

    // Add sample data if none exists
    if (savedSubscriptions.length === 0) {
      const sampleSubscription: Subscription = {
        id: "SUB001",
        planName: "1 Month Access",
        duration: "30 Days",
        price: 30000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Active",
        moviesWatched: 15,
        totalMovies: 500,
      }
      setSubscriptions([sampleSubscription])
      localStorage.setItem("subscriptions", JSON.stringify([sampleSubscription]))
    } else {
      setSubscriptions(savedSubscriptions)
    }

    setWatchHistory(savedWatchHistory)
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

  const filteredHistory = watchHistory.filter((item) =>
    item.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Expired":
        return <Clock className="h-5 w-5 text-red-500" />
      case "Cancelled":
        return <Clock className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground mb-8">You need to be logged in to view your subscriptions.</p>
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
          <h1 className="text-3xl font-bold mb-2">My Subscriptions</h1>
          <p className="text-muted-foreground mb-8">Track and manage your movie subscriptions</p>

          {/* Active Subscriptions */}
          <div className="glass dark:glass-dark rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{subscription.planName}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              subscription.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : subscription.status === "Expired"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {subscription.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Started {formatDistanceToNow(new Date(subscription.startDate), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center gap-2">
                        {getStatusIcon(subscription.status)}
                        <span className="text-sm font-medium">{formatUGX(subscription.price)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm">{subscription.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Movies Watched</p>
                        <p className="text-sm font-medium">
                          {subscription.moviesWatched} / {subscription.totalMovies}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expires</p>
                        <p className="text-sm">
                          {formatDistanceToNow(new Date(subscription.endDate), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/subscription">Manage Plan</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/movies">Watch Movies</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active subscriptions</h3>
                <p className="text-muted-foreground mb-6">Subscribe to start watching amazing Luo ancient movies.</p>
                <Button asChild>
                  <Link href="/subscription">Choose a Plan</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Watch History */}
          <div className="glass dark:glass-dark rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Watch History</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="relative h-32 w-full rounded-md overflow-hidden mb-3">
                      <Image
                        src={item.moviePoster || "/placeholder.svg"}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">{item.movieTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Watched {formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}
                    </p>
                    <div className="w-full bg-secondary rounded-full h-2 mb-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(item.progress / item.duration) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((item.progress / item.duration) * 100)}% complete
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No watch history</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "No movies match your search." : "Start watching movies to see your history here."}
                </p>
                <Button asChild>
                  <Link href="/movies">Browse Movies</Link>
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
