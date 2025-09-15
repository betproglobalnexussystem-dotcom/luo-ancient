"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { movieService, type Movie as DbMovie } from "@/lib/firebase-services"

type UIMovie = {
  id: string
  title: string
  year: number
  rating: number
  genre: string
  poster: string
  duration: string
  isNew?: boolean
}

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [allMovies, setAllMovies] = useState<UIMovie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data: DbMovie[] = await movieService.getAllMovies()
        if (!active) return
        const ui: UIMovie[] = data.map((m) => ({
          id: m.id!,
          title: m.title,
          year: new Date(m.createdAt || Date.now()).getFullYear(),
          rating: m.rating,
          genre: m.genre,
          poster: m.poster,
          duration: m.duration,
          isNew: Boolean(m.createdAt && Date.now() - (m.createdAt as number) < 30 * 24 * 60 * 60 * 1000),
        }))
        setAllMovies(ui)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filteredMovies = allMovies
    .filter((movie) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.genre.toLowerCase().includes(searchLower) ||
        movie.year.toString().includes(searchLower) ||
        movie.duration?.toLowerCase().includes(searchLower)
      const matchesGenre = selectedGenre === "all" || movie.genre.toLowerCase() === selectedGenre.toLowerCase()
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.year - a.year
        case "oldest":
          return a.year - b.year
        case "rating":
          return b.rating - a.rating
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const genres = [
    "all",
    "action",
    "drama",
    "historical",
    "adventure",
    "mystery",
    "biography",
    "musical",
    "supernatural",
    "epic",
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All Movies</h1>
            <p className="text-muted-foreground">Discover our complete collection of Luo Ancient Movies</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre === "all" ? "All Genres" : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                genre={movie.genre}
                poster={movie.poster}
                duration={movie.duration}
                isNew={movie.isNew}
              />
            ))}
          </div>

          {loading && (
            <div className="text-sm text-muted-foreground py-6">Loading...</div>
          )}
          {!loading && filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedGenre("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
