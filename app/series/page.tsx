"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SeriesCard } from "@/components/series-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { seriesService, type Series as DbSeries } from "@/lib/firebase-services"

type UISeries = {
  id: string
  title: string
  year: number
  rating: number
  genre: string
  poster: string
  seasons: number
  episodes: number
  isNew?: boolean
}

export default function SeriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [allSeries, setAllSeries] = useState<UISeries[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data: DbSeries[] = await seriesService.getAllSeries()
        if (!active) return
        const ui: UISeries[] = data.map((s) => ({
          id: s.id!,
          title: s.title,
          year: new Date(s.createdAt || Date.now()).getFullYear(),
          rating: 0,
          genre: "",
          poster: s.poster,
          seasons: 0,
          episodes: 0,
          isNew: Boolean(s.createdAt && Date.now() - (s.createdAt as number) < 30 * 24 * 60 * 60 * 1000),
        }))
        setAllSeries(ui)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filteredSeries = allSeries
    .filter((series) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        series.title.toLowerCase().includes(searchLower) ||
        series.genre.toLowerCase().includes(searchLower) ||
        series.year.toString().includes(searchLower) ||
        series.seasons?.toString().includes(searchLower) ||
        series.episodes?.toString().includes(searchLower)
      const matchesGenre = selectedGenre === "all" || series.genre.toLowerCase() === selectedGenre.toLowerCase()
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

  const genres = ["all", "drama", "historical", "adventure", "supernatural", "epic"]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">All Series</h1>
            <p className="text-muted-foreground">Explore our captivating series collection</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search series..."
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

          {/* Series Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredSeries.map((series) => (
              <SeriesCard
                key={series.id}
                id={series.id}
                title={series.title}
                year={series.year}
                rating={series.rating}
                genre={series.genre}
                poster={series.poster}
                seasons={series.seasons}
                episodes={series.episodes}
                isNew={series.isNew}
              />
            ))}
          </div>

          {loading && (
            <div className="text-sm text-muted-foreground py-6">Loading...</div>
          )}
          {!loading && filteredSeries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No series found matching your criteria.</p>
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
