"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  productCode?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error)
    }
  }, [items])

  const addItem = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setItems((prevItems) => [...prevItems, item])

      toast({
        title: "Added to wishlist",
        description: `${item.name} has been added to your wishlist`,
      })
    }
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  const clearWishlist = () => {
    setItems([])

    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    })
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }

  return context
}
