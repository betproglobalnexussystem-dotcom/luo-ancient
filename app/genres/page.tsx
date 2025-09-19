"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { SeriesCard } from "@/components/series-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Film, Tv } from "lucide-react"
import { movieService, seriesService, type Movie, type Series } from "@/lib/firebase-services"

const genreData = {
  Action: {
    description: "High-octane adventures and thrilling combat sequences",
    movies: [
      {
        id: "m1",
        title: "Ancient Warriors",
        year: 2024,
        rating: 4.8,
        genre: "Action",
        poster: "/ancient-warriors-movie-poster.jpg",
        duration: "2h 15m",
        isNew: true,
      },
      {
        id: "m2",
        title: "The Last Battle",
        year: 2023,
        rating: 4.6,
        genre: "Action",
        poster: "/action-movie-poster.png",
        duration: "1h 58m",
        isNew: false,
      },
    ],
    series: [
      {
        id: "s1",
        title: "Warriors of the Nile",
        year: 2024,
        rating: 4.7,
        genre: "Action",
        poster: "/action-series-poster.png",
        seasons: 2,
        episodes: 16,
        isNew: true,
      },
    ],
  },
  Indian: {
    description: "Indian movies and series collection",
    movies: [],
    series: [],
  },
  War: {
    description: "War-themed stories and battles",
    movies: [],
    series: [],
  },
  Kungfu: {
    description: "Kungfu and martial arts action",
    movies: [],
    series: [],
  },
  Nigeria: {
    description: "Nigerian Nollywood picks",
    movies: [],
    series: [],
  },
}

export default function GenresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("Action")

  const genres = Object.keys(genreData)
  const currentGenreData = genreData[selectedGenre as keyof typeof genreData]

  const filteredMovies = currentGenreData.movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSeries = currentGenreData.series.filter((series) =>
    series.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse by Genre</h1>
            <p className="text-muted-foreground">Discover content by your favorite genres</p>
          </div>

          {/* Genre Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  onClick={() => setSelectedGenre(genre)}
                  className="rounded-full"
                >
                  {genre}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${selectedGenre.toLowerCase()} content...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Genre Header */}
          <div className="mb-8 glass dark:glass-dark rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">{selectedGenre}</h2>
            <p className="text-muted-foreground">{currentGenreData.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Film className="h-4 w-4" />
                <span>{currentGenreData.movies.length} Movies</span>
              </div>
              <div className="flex items-center gap-1">
                <Tv className="h-4 w-4" />
                <span>{currentGenreData.series.length} Series</span>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="movies" className="space-y-6">
            <TabsList>
              <TabsTrigger value="movies" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                Movies ({filteredMovies.length})
              </TabsTrigger>
              <TabsTrigger value="series" className="flex items-center gap-2">
                <Tv className="h-4 w-4" />
                Series ({filteredSeries.length})
              </TabsTrigger>
            </TabsList>

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
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `No ${selectedGenre.toLowerCase()} movies match your search.`
                      : `No ${selectedGenre.toLowerCase()} movies available yet.`}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="series">
              {filteredSeries.length > 0 ? (
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
              ) : (
                <div className="text-center py-12">
                  <Tv className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No series found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `No ${selectedGenre.toLowerCase()} series match your search.`
                      : `No ${selectedGenre.toLowerCase()} series available yet.`}
                  </p>
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
