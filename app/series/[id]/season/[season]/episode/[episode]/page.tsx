"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"

interface Episode {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string
  thumbnail: string
  episodeNumber: number
  seasonNumber: number
}

export default function EpisodePage() {
  const params = useParams()
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sample episode data - in real app, fetch from API
    const sampleEpisode: Episode = {
      id: `${params.id}-s${params.season}-e${params.episode}`,
      title: `Episode ${params.episode}: The Journey Begins`,
      description: "Our heroes embark on their epic adventure.",
      duration: "45m",
      videoUrl: "/sample-episode.mp4",
      thumbnail: `/episode-${params.episode}-thumb.jpg`,
      episodeNumber: Number.parseInt(params.episode as string),
      seasonNumber: Number.parseInt(params.season as string),
    }

    setEpisode(sampleEpisode)
    setLoading(false)

    // Add to watch history
    const watchHistory = JSON.parse(localStorage.getItem("watchHistory") || "[]")
    const newEntry = {
      id: Date.now().toString(),
      movieId: params.id,
      movieTitle: `Legends of the Lake - S${params.season}E${params.episode}`,
      moviePoster: sampleEpisode.thumbnail,
      watchedAt: new Date().toISOString(),
      progress: 0,
      duration: 2700, // 45 minutes in seconds
    }
    watchHistory.unshift(newEntry)
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory.slice(0, 50)))
  }, [params, router])

  const handleClose = () => {
    router.push(`/series/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Episode Not Found</h1>
          <button onClick={handleClose} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200">
            Back to Series
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer src={episode.videoUrl} poster={episode.thumbnail} title={episode.title} onClose={handleClose} />
    </div>
  )
}
