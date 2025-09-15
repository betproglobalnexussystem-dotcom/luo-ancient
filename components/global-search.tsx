"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Film, Tv, Clock, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  type: "movie" | "series"
  year: number
  rating: number
  genre: string
  poster: string
  duration?: string
  seasons?: number
  episodes?: number
}

interface GlobalSearchProps {
  placeholder?: string
  className?: string
  onResultClick?: () => void
}

// Mock data - in a real app, this would come from an API
const searchData: SearchResult[] = [
  {
    id: "1",
    title: "Ancient Warriors",
    type: "movie",
    year: 2024,
    rating: 4.8,
    genre: "Action",
    poster: "/ancient-warriors-movie-poster.jpg",
    duration: "2h 15m"
  },
  {
    id: "2",
    title: "The Drum Keeper",
    type: "movie",
    year: 2023,
    rating: 4.7,
    genre: "Historical",
    poster: "/placeholder-661g8.png",
    duration: "2h 5m"
  },
  {
    id: "3",
    title: "River of Spirits",
    type: "series",
    year: 2023,
    rating: 4.5,
    genre: "Supernatural",
    poster: "/placeholder-3kwqa.png",
    seasons: 2,
    episodes: 12
  },
  {
    id: "4",
    title: "The Last Chief",
    type: "movie",
    year: 2022,
    rating: 4.9,
    genre: "Biography",
    poster: "/placeholder-m4h0i.png",
    duration: "2h 30m"
  },
  {
    id: "5",
    title: "Songs of the Ancestors",
    type: "movie",
    year: 2022,
    rating: 4.4,
    genre: "Musical",
    poster: "/placeholder-0v3yl.png",
    duration: "1h 50m"
  },
  {
    id: "6",
    title: "The Sacred Grove",
    type: "movie",
    year: 2024,
    rating: 4.6,
    genre: "Mystery",
    poster: "/placeholder-otgwi.png",
    duration: "2h 10m"
  },
  {
    id: "7",
    title: "Fisherman's Tale",
    type: "movie",
    year: 2024,
    rating: 4.3,
    genre: "Adventure",
    poster: "/placeholder-f6944.png",
    duration: "1h 40m"
  },
  {
    id: "8",
    title: "The Healer's Journey",
    type: "series",
    year: 2024,
    rating: 4.7,
    genre: "Drama",
    poster: "/placeholder-meucu.png",
    seasons: 1,
    episodes: 8
  }
]

export function GlobalSearch({ placeholder = "Search movies, series...", className, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Search function with fuzzy matching
  const searchItems = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    
    return searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const genreMatch = item.genre.toLowerCase().includes(query)
      const yearMatch = item.year.toString().includes(query)
      
      return titleMatch || genreMatch || yearMatch
    }).sort((a, b) => {
      // Prioritize exact title matches
      const aTitleExact = a.title.toLowerCase() === query
      const bTitleExact = b.title.toLowerCase() === query
      if (aTitleExact && !bTitleExact) return -1
      if (!aTitleExact && bTitleExact) return 1
      
      // Then prioritize title starts with query
      const aTitleStarts = a.title.toLowerCase().startsWith(query)
      const bTitleStarts = b.title.toLowerCase().startsWith(query)
      if (aTitleStarts && !bTitleStarts) return -1
      if (!aTitleStarts && bTitleStarts) return 1
      
      // Then by rating (higher first)
      return b.rating - a.rating
    })
  }

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value)
    const searchResults = searchItems(value)
    setResults(searchResults)
    setIsOpen(value.length > 0)
    setSelectedIndex(-1)
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    const path = result.type === "movie" ? `/movie/${result.id}` : `/series/${result.id}`
    router.push(path)
    setIsOpen(false)
    setQuery("")
    onResultClick?.()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setQuery("")
        inputRef.current?.blur()
        break
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className={cn("relative w-full", className)} ref={resultsRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">K</kbd>
          </div>
        )}
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery("")
              setResults([])
              setIsOpen(false)
              inputRef.current?.focus()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors",
                      selectedIndex === index && "bg-muted"
                    )}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={result.poster}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {result.type === "movie" ? (
                          <Film className="h-4 w-4 text-primary" />
                        ) : (
                          <Tv className="h-4 w-4 text-primary" />
                        )}
                        <h3 className="font-medium truncate">{result.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {result.year}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{result.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{result.genre}</span>
                        {result.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{result.duration}</span>
                            </div>
                          </>
                        )}
                        {result.seasons && (
                          <>
                            <span>•</span>
                            <span>{result.seasons}S • {result.episodes}E</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
