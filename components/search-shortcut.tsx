"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function SearchShortcut() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl/Cmd + K is pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        router.push('/search')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  return null
}







