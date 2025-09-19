"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { MovieCard } from "@/components/movie-card"
import { SeriesCard } from "@/components/series-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Clock, Film, Tv } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - in a real app, this would come from an API
const searchData = {
  movies: [
    {
      id: "1",
      title: "Ancient Warriors",
      year: 2024,
      rating: 4.8,
      genre: "Action",
      poster: "/ancient-warriors-movie-poster.jpg",
      duration: "2h 15m",
      isNew: true,
    },
    {
      id: "2",
      title: "The Drum Keeper",
      year: 2023,
      rating: 4.7,
      genre: "Historical",
      poster: "/placeholder-661g8.png",
      duration: "2h 5m",
      isNew: false,
    },
    {
      id: "4",
      title: "The Last Chief",
      year: 2022,
      rating: 4.9,
      genre: "Biography",
      poster: "/placeholder-m4h0i.png",
      duration: "2h 30m",
      isNew: false,
    },
    {
      id: "5",
      title: "Songs of the Ancestors",
      year: 2022,
      rating: 4.4,
      genre: "Musical",
      poster: "/placeholder-0v3yl.png",
      duration: "1h 50m",
      isNew: false,
    },
    {
      id: "6",
      title: "The Sacred Grove",
      year: 2024,
      rating: 4.6,
      genre: "Mystery",
      poster: "/placeholder-otgwi.png",
      duration: "2h 10m",
      isNew: true,
    },
    {
      id: "7",
      title: "Fisherman's Tale",
      year: 2024,
      rating: 4.3,
      genre: "Adventure",
      poster: "/placeholder-f6944.png",
      duration: "1h 40m",
      isNew: true,
    },
  ],
  series: [
    {
      id: "3",
      title: "River of Spirits",
      year: 2023,
      rating: 4.5,
      genre: "Supernatural",
      poster: "/placeholder-3kwqa.png",
      seasons: 2,
      episodes: 12,
      isNew: false,
    },
    {
      id: "8",
      title: "The Healer's Journey",
      year: 2024,
      rating: 4.7,
      genre: "Drama",
      poster: "/placeholder-meucu.png",
      seasons: 1,
      episodes: 8,
      isNew: true,
    },
  ]
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedGenre, setSelectedGenre] = useState("all")

  // Search function
  const searchItems = (items: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return items

    const query = searchQuery.toLowerCase().trim()
    
    return items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const genreMatch = item.genre.toLowerCase().includes(query)
      const yearMatch = item.year.toString().includes(query)
      
      return titleMatch || genreMatch || yearMatch
    })
  }

  // Sort function
  const sortItems = (items: any[], sortType: string) => {
    switch (sortType) {
      case "newest":
        return [...items].sort((a, b) => b.year - a.year)
      case "oldest":
        return [...items].sort((a, b) => a.year - b.year)
      case "rating":
        return [...items].sort((a, b) => b.rating - a.rating)
      case "title":
        return [...items].sort((a, b) => a.title.localeCompare(b.title))
      default:
        return items
    }
  }

  // Filter by genre
  const filterByGenre = (items: any[], genre: string) => {
    if (genre === "all") return items
    return items.filter(item => item.genre.toLowerCase() === genre.toLowerCase())
  }

  // Get filtered and sorted results
  const getFilteredResults = (items: any[]) => {
    let filtered = searchItems(items, query)
    filtered = filterByGenre(filtered, selectedGenre)
    return sortItems(filtered, sortBy)
  }

  const filteredMovies = getFilteredResults(searchData.movies)
  const filteredSeries = getFilteredResults(searchData.series)
  const allResults = [...filteredMovies, ...filteredSeries]

  const genres = ["all", "action", "drama", "historical", "adventure", "mystery", "biography", "musical", "supernatural", "epic"]

  // Update URL when search changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (query) {
        url.searchParams.set("q", query)
      } else {
        url.searchParams.delete("q")
      }
      window.history.replaceState({}, "", url.toString())
    }
  }, [query])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {query ? `Search Results for "${query}"` : "Search"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {query ? `Found ${allResults.length} results` : "Discover movies and series"}
            </p>

            {/* Search Input */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies, series, genres..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
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
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="title">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {query ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  All ({allResults.length})
                </TabsTrigger>
                <TabsTrigger value="movies" className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  Movies ({filteredMovies.length})
                </TabsTrigger>
                <TabsTrigger value="series" className="flex items-center gap-2">
                  <Tv className="h-4 w-4" />
                  Series ({filteredSeries.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {allResults.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {allResults.map((item) => (
                      item.seasons ? (
                        <SeriesCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          year={item.year}
                          rating={item.rating}
                          genre={item.genre}
                          poster={item.poster}
                          seasons={item.seasons}
                          episodes={item.episodes}
                          isNew={item.isNew}
                        />
                      ) : (
                        <MovieCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          year={item.year}
                          rating={item.rating}
                          genre={item.genre}
                          poster={item.poster}
                          duration={item.duration}
                          isNew={item.isNew}
                        />
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery("")
                        setSelectedGenre("all")
                        setSortBy("relevance")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="movies">
                {filteredMovies.length > 0 ? (
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
                ) : (
                  <div className="text-center py-12">
                    <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No movies found</h3>
                    <p className="text-muted-foreground">Try a different search term or filter</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="series">
                {filteredSeries.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
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
                ) : (
                  <div className="text-center py-12">
                    <Tv className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No series found</h3>
                    <p className="text-muted-foreground">Try a different search term or filter</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Start Searching</h3>
              <p className="text-muted-foreground">
                Enter a movie title, series name, or genre to get started
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-12 md:pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
