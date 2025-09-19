"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { movieService } from "@/lib/firebase-services"
import { VideoPlayer } from "@/components/video-player"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"

interface MovieDoc {
  id: string
  title: string
  poster: string
  videoUrl?: string
}

export default function PlayPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [movie, setMovie] = useState<MovieDoc | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine if user has access: admins always true; otherwise active subscription
  const hasAccess = useMemo(() => {
    if (!user) return false
    if (user.role === "admin") return true
    const active = user.subscription?.isActive && (!!user.subscription?.expiresAt ? new Date(user.subscription.expiresAt) > new Date() : true)
    return !!active
  }, [user])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const doc = await movieService.getMovieById(params.id as string)
        if (!active) return
        if (doc) {
          setMovie({ id: params.id as string, title: doc.title, poster: doc.poster, videoUrl: doc.videoUrl })
        } else {
          setMovie(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [params.id])

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.replace("/subscription")
    }
  }, [loading, hasAccess, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <button onClick={() => router.push("/movies")} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">Back to Movies</button>
        </div>
      </div>
    )
  }

  // If the URL is embeddable, use iframe; else fallback to native player
  const url = movie.videoUrl || ""
  const isEmbeddable = url && /^(https?:)?\/\//.test(url) && /(youtube|youtu\.be|drive\.google|ok\.ru|dood|vimeo|mega|mp4upload|streamtape|player)/i.test(url)

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden bg-black">
            <AspectRatio ratio={16/9}>
              {isEmbeddable ? (
                <iframe
                  src={url}
                  title={movie.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="w-full h-full"
                />
              ) : (
                <VideoPlayer src={url} poster={movie.poster} title={movie.title} onClose={() => router.back()} />
              )}
            </AspectRatio>
          </div>

          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-semibold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">HD</Badge>
              <Badge variant="outline">Luo Ancient Movies</Badge>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-3">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="relative w-40 h-24 rounded overflow-hidden bg-muted flex-shrink-0">
                  {/* placeholder thumbnail */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">Related Video {i}</p>
                  <p className="text-xs text-muted-foreground">Action • 12:34</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


