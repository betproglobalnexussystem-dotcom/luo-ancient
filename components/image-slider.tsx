"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type Slide } from "@/lib/firebase-services"

interface ImageSliderProps {
  slides: Slide[]
  autoSlide?: boolean
  slideInterval?: number
}

export function ImageSlider({ slides, autoSlide = true, slideInterval = 5000 }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slideInterval)

    return () => clearInterval(interval)
  }, [slides.length, autoSlide, slideInterval])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-800 to-red-700"></div>
      </div>
    )
  }

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden group">
      {/* Main Image */}
      <Image
        src={slides[currentSlide]?.imageUrl || "/placeholder.svg"}
        alt={slides[currentSlide]?.caption || ""}
        fill
        className="object-cover transition-opacity duration-500"
        priority
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 flex items-center">
        <div className="container mx-auto px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {slides[currentSlide]?.caption || ""}
          </h1>
          {slides[currentSlide]?.link && (
            <Button size="lg" asChild>
              <Link href={slides[currentSlide].link!}>Explore</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
