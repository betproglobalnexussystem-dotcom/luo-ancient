"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { seriesService } from "@/lib/firebase-services"
import { Play, Heart, Share2, Star, Clock, Calendar, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Episode {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  episodeNumber: number
  seasonNumber: number
  airDate: string
  watched: boolean
}

interface Season {
  number: number
  episodes: Episode[]
  title: string
  description: string
}

interface Series {
  id: string
  title: string
  description: string
  poster: string
  backdrop: string
  genre: string[]
  rating: number
  seasons: Season[]
  releaseYear: number
  director: string
  cast: string[]
  language: string
  subtitles: string[]
  totalEpisodes: number
}

export default function SeriesPage() {
  const params = useParams()
  const router = useRouter()
  const [series, setSeries] = useState<Series | null>(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const all = await seriesService.getAllSeries()
        const s = all.find((x) => x.id === (params.id as string))
        if (!active) return
        if (s) {
          const ui: Series = {
            id: s.id!,
            title: s.title,
            description: s.description,
            poster: s.poster,
            backdrop: s.poster,
            genre: s.status ? [s.status] : [],
            rating: 0,
            releaseYear: new Date(s.createdAt || Date.now()).getFullYear(),
            director: "",
            cast: [],
            language: "",
            subtitles: [],
            totalEpisodes: 0,
            seasons: [],
          }
          setSeries(ui)
        } else {
          setSeries(null)
        }
      } finally {
        if (active) setLoading(false)
      }
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setIsInWishlist(wishlist.includes(params.id))
    }
    load()
    return () => { active = false }
  }, [params.id])

  const handlePlayEpisode = (episode: Episode) => {
    // Navigate to episode player (public)
    router.push(`/series/${params.id}/season/${episode.seasonNumber}/episode/${episode.episodeNumber}`)
  }

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (isInWishlist) {
      const newWishlist = wishlist.filter((id: string) => id !== params.id)
      localStorage.setItem("wishlist", JSON.stringify(newWishlist))
      setIsInWishlist(false)
    } else {
      wishlist.push(params.id)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      setIsInWishlist(true)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Series Not Found</h1>
            <Button asChild>
              <Link href="/series">Browse Series</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentSeason = series.seasons.find((s) => s.number === selectedSeason)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src={series.backdrop || series.poster || "/placeholder.svg"}
            alt={series.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{series.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{series.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Users className="h-4 w-4" />
                    <span>
                      {series.seasons.length} Season{series.seasons.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Calendar className="h-4 w-4" />
                    <span>{series.releaseYear}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {series.genre.map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-8 line-clamp-3">{series.description}</p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => handlePlayEpisode(currentSeason?.episodes[0] || series.seasons[0].episodes[0])}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    Watch Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleWishlist}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                  <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        <div className="container mx-auto px-4 py-12">
          <Tabs value={selectedSeason.toString()} onValueChange={(value) => setSelectedSeason(Number.parseInt(value))}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Episodes</h2>
              <TabsList>
                {series.seasons.map((season) => (
                  <TabsTrigger key={season.number} value={season.number.toString()}>
                    Season {season.number}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {series.seasons.map((season) => (
              <TabsContent key={season.number} value={season.number.toString()}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{season.title}</h3>
                  <p className="text-muted-foreground">{season.description}</p>
                </div>

                <div className="grid gap-4">
                  {season.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="glass dark:glass-dark rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={episode.thumbnail || "/placeholder.svg"}
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => handlePlayEpisode(episode)}
                          >
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-lg">
                                {episode.episodeNumber}. {episode.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{episode.duration}</span>
                                <span>•</span>
                                <span>{new Date(episode.airDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePlayEpisode(episode)}
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              Play
                            </Button>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2">{episode.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Series Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About This Series</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{series.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Cast</h3>
                  <ul className="space-y-1">
                    {series.cast.map((actor) => (
                      <li key={actor} className="text-muted-foreground">
                        {actor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Details</h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Director</dt>
                      <dd>{series.director}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Language</dt>
                      <dd>{series.language}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Subtitles</dt>
                      <dd>{series.subtitles.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Total Episodes</dt>
                      <dd>{series.totalEpisodes}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div>
              <div className="glass dark:glass-dark rounded-xl p-6">
                <h3 className="font-semibold mb-4">More Like This</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="relative h-16 w-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={`/ceholder-svg-key-series.jpg?key=series${i}&height=64&width=48&query=series${i}`}
                          alt={`Related series ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">Related Series {i}</h4>
                        <p className="text-xs text-muted-foreground">Drama, Historical</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs">4.{i + 3}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
