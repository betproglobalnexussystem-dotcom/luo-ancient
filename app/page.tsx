"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { movieService, slideService, type Movie, type Slide } from "@/lib/firebase-services"

export default function Home() {
  const [latest, setLatest] = useState<Movie[]>([])
  const [isLoadingLatest, setIsLoadingLatest] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([])
  const [isLoadingSlides, setIsLoadingSlides] = useState(false)
  useEffect(() => {
    let mounted = true
    setIsLoadingLatest(true)
    movieService.getAllMovies()
      .then((data) => { if (mounted) setLatest(data) })
      .finally(() => { if (mounted) setIsLoadingLatest(false) })
    setIsLoadingSlides(true)
    slideService.getSlides()
      .then((data) => { if (mounted) setSlides(data) })
      .finally(() => { if (mounted) setIsLoadingSlides(false) })
    return () => { mounted = false }
  }, [])
  const heroSlide = slides[0]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-12 md:pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section (Slides) */}
          <div className="mb-12 relative h-96 rounded-2xl overflow-hidden">
            {heroSlide ? (
              <>
                <Image src={heroSlide.imageUrl || "/placeholder.svg"} alt={heroSlide.caption || ""} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 flex items-center">
                  <div className="container mx-auto px-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{heroSlide.caption || ""}</h1>
                    {heroSlide.link && (
                      <Button size="lg" asChild>
                        <Link href={heroSlide.link}>Explore</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-800 to-red-700"></div>
            )}
          </div>

          {/* Latest (from Realtime Database) */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Latest</h2>
              <Button variant="outline" asChild>
                <Link href="/movies">View All</Link>
              </Button>
            </div>
            {isLoadingLatest ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                {latest.slice(0, 20).map((m) => (
                  <MovieCard
                    key={m.id}
                    id={m.id!}
                    title={m.title}
                    year={new Date(m.createdAt || Date.now()).getFullYear()}
                    rating={m.rating}
                    genre={m.genre}
                    poster={m.poster}
                    duration={m.duration}
                    isNew={Boolean(m.createdAt && Date.now() - (m.createdAt as number) < 30 * 24 * 60 * 60 * 1000)}
                  />
                ))}
                {latest.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground">No content yet</div>
                )}
              </div>
            )}
          </div>

          {/* Only dynamic Latest section retained */}

          {/* Browse by Genre Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Browse by Genre</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/genres?genre=action" className="relative h-60 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">Action</h3>
                    <span className="text-white/80 text-sm">Explore Now</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-red-500/20"></div>
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-500 group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
              <Link href="/genres?genre=drama" className="relative h-60 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">Drama</h3>
                    <span className="text-white/80 text-sm">Explore Now</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/20"></div>
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-500 group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
              <Link href="/genres?genre=historical" className="relative h-60 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">Historical</h3>
                    <span className="text-white/80 text-sm">Explore Now</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-yellow-500/20"></div>
                <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-orange-500 group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
              <Link href="/genres?genre=adventure" className="relative h-60 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">Adventure</h3>
                    <span className="text-white/80 text-sm">Explore Now</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-green-500/20"></div>
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-500 group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
