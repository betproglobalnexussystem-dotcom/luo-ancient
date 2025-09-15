"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoPlayer } from "@/components/video-player"
import { movieService } from "@/lib/firebase-services"
import { Play, Heart, Share2, Star, Clock, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Movie {
  id: string
  title: string
  description: string
  poster: string
  trailer: string
  fullMovie: string
  genre: string[]
  rating: number
  duration: string
  releaseYear: number
  director: string
  cast: string[]
  language: string
  subtitles: string[]
}

export default function MoviePage() {
  const params = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        const m = await movieService.getMovieById(params.id as string)
        if (!active) return
        if (m) {
          const transformed: Movie = {
            id: (m.id as string) || (params.id as string),
            title: m.title,
            description: m.description,
            poster: m.poster,
            trailer: m.videoUrl || "",
            fullMovie: m.videoUrl || "",
            genre: (m.genre || "").split(",").map(g => g.trim()).filter(Boolean).length > 0 ? (m.genre || "").split(",").map(g => g.trim()).filter(Boolean) : [m.genre].filter(Boolean) as string[],
            rating: m.rating || 0,
            duration: m.duration || "",
            releaseYear: new Date().getFullYear(),
            director: "",
            cast: [],
            language: "",
            subtitles: [],
          }
          setMovie(transformed)
        } else {
          setMovie(null)
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

  const handlePlay = () => {
    setIsPlaying(true)

    // Add to watch history
    const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")
    const newEntry = {
      id: Date.now().toString(),
      movieId: movie?.id,
      movieTitle: movie?.title,
      moviePoster: movie?.poster,
      watchedAt: new Date().toISOString(),
      progress: 0,
      duration: 8100, // 2h 15m in seconds
    }
    watchHistory.unshift(newEntry)
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory.slice(0, 50)))
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

  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <Button asChild>
              <Link href="/movies">Browse Movies</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isPlaying) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <VideoPlayer
          src={movie.fullMovie}
          poster={movie.poster}
          title={movie.title}
          onClose={() => setIsPlaying(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.releaseYear}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-8 line-clamp-3">{movie.description}</p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={handlePlay} className="flex items-center gap-2">
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

        {/* Movie Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About This Movie</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{movie.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Cast</h3>
                  <ul className="space-y-1">
                    {movie.cast.map((actor) => (
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
                      <dd>{movie.director}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Language</dt>
                      <dd>{movie.language}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Subtitles</dt>
                      <dd>{movie.subtitles.join(", ")}</dd>
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
                          src={`/classic-movie-theater.png?height=64&width=48&query=movie${i}`}
                          alt={`Related movie ${i}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">Related Movie {i}</h4>
                        <p className="text-xs text-muted-foreground">Action, Drama</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs">4.{i + 2}</span>
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
