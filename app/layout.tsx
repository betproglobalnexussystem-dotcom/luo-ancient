import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import { SearchShortcut } from "@/components/search-shortcut"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CineMax - Premium Movie Streaming Platform",
  description: "Stream the latest movies, TV shows, and exclusive content on CineMax",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <SearchShortcut />
                <div className="animated-gradient min-h-screen">{children}</div>
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
