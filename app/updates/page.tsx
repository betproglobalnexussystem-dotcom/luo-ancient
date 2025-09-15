"use client"

import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { SeriesCard } from "@/components/series-card"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Film, Tv, Star } from "lucide-react"

const recentUpdates = [
  {
    id: "1",
    title: "Ancient Warriors",
    type: "movie",
    year: 2024,
    rating: 4.8,
    genre: "Action",
    poster: "/ancient-warriors-movie-poster.jpg",
    duration: "2h 15m",
    seasons: 0,
    episodes: 0,
    isNew: true,
    addedDate: "2024-01-15",
    description: "Epic tale of Luo warriors defending their homeland",
  },
  {
    id: "2",
    title: "Legends of the Lake - Season 2",
    type: "series",
    year: 2024,
    rating: 4.6,
    genre: "Drama",
    poster: "/lake-legends-movie-poster.jpg",
    duration: "",
    seasons: 2,
    episodes: 8,
    isNew: true,
    addedDate: "2024-01-10",
    description: "New season exploring deeper mysteries of Lake Victoria",
  },
  {
    id: "3",
    title: "The Sacred Grove",
    type: "movie",
    year: 2024,
    rating: 4.6,
    genre: "Mystery",
    poster: "/placeholder-otgwi.png",
    duration: "2h 10m",
    seasons: 0,
    episodes: 0,
    isNew: true,
    addedDate: "2024-01-05",
    description: "A mystical journey through ancient sacred grounds",
  },
  {
    id: "4",
    title: "The Fisherman's Legacy - New Episodes",
    type: "series",
    year: 2024,
    rating: 4.4,
    genre: "Adventure",
    poster: "/placeholder-04jxh.png",
    duration: "",
    seasons: 1,
    episodes: 10,
    isNew: true,
    addedDate: "2023-12-28",
    description: "Follow the adventures of a legendary fisherman's descendants",
  },
]

const upcomingReleases = [
  {
    title: "The Warrior Queen",
    type: "movie",
    genre: "Historical",
    releaseDate: "2024-02-15",
    description: "The story of a legendary Luo queen who united the tribes",
  },
  {
    title: "River Tales - Season 1",
    type: "series",
    genre: "Drama",
    releaseDate: "2024-03-01",
    description: "Stories from communities along the great rivers",
  },
  {
    title: "The Last Hunt",
    type: "movie",
    genre: "Adventure",
    releaseDate: "2024-03-20",
    description: "A father's final hunting expedition with his son",
  },
]

export default function UpdatesPage() {
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
                ),
              )}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingReleases.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
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
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{item.genre}</Badge>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.releaseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
