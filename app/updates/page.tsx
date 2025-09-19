"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { SeriesCard } from "@/components/series-card"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Film, Tv, Star } from "lucide-react"
import { movieService, seriesService, updatesService, type Movie, type Series, type UpdateItem } from "@/lib/firebase-services"

export default function UpdatesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [moviesData, seriesData, updatesData] = await Promise.all([
          movieService.getAllMovies(),
          seriesService.getAllSeries(),
          updatesService.getUpdates()
        ])
        
        setMovies(moviesData)
        setSeries(seriesData)
        setUpdates(updatesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Combine movies and series for recent updates
  const recentUpdates = [
    ...movies.slice(0, 10).map(movie => ({
      ...movie,
      type: "movie" as const,
      year: new Date(movie.createdAt || Date.now()).getFullYear(),
      addedDate: new Date(movie.createdAt || Date.now()).toISOString().split('T')[0],
      isNew: Boolean(movie.createdAt && Date.now() - (movie.createdAt as number) < 7 * 24 * 60 * 60 * 1000)
    })),
    ...series.slice(0, 5).map(series => ({
      ...series,
      type: "series" as const,
      year: new Date(series.createdAt || Date.now()).getFullYear(),
      addedDate: new Date(series.createdAt || Date.now()).toISOString().split('T')[0],
      isNew: Boolean(series.createdAt && Date.now() - (series.createdAt as number) < 7 * 24 * 60 * 60 * 1000),
      seasons: 1,
      episodes: 8
    }))
  ].sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow pt-12 md:pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading updates...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Latest Updates</h1>
            <p className="text-muted-foreground">Stay up to date with new movies, series, and episodes</p>
          </div>

          {/* Recent Additions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
            <div className="space-y-6">
              {recentUpdates.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-64 md:h-auto">
                        <img
                          src={item.poster || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary">
                                {item.type === "movie" ? (
                                  <>
                                    <Film className="h-3 w-3 mr-1" /> Movie
                                  </>
                                ) : (
                                  <>
                                    <Tv className="h-3 w-3 mr-1" /> Series
                                  </>
                                )}
                              </Badge>
                              <Badge variant="outline">{item.genre}</Badge>
                              {item.isNew && <Badge className="bg-primary">NEW</Badge>}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground mb-4">{item.description}</p>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(item.addedDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{item.year}</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{item.rating}</span>
                            </div>
                            {item.type === "movie" ? (
                              <span>{item.duration}</span>
                            ) : (
                              <span>
                                {item.seasons} Season{item.seasons > 1 ? "s" : ""} • {item.episodes} Episodes
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Latest Content Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">New This Week</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {recentUpdates.map((item) =>
                item.type === "movie" ? (
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
                ) : (
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
                )
              )}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updates.length > 0 ? (
                updates.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="secondary">
                          <Calendar className="h-3 w-3 mr-1" /> Update
                        </Badge>
                      </div>
                      <CardDescription>{item.body}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline">News</Badge>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground">
                  No updates available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
