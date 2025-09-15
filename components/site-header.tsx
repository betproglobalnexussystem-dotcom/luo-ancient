"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Play, User, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { GlobalSearch } from "@/components/global-search"
import Image from "next/image"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Series", href: "/series" },
    { name: "Updates", href: "/updates" },
    { name: "Genres", href: "/genres" },
    { name: "Subscription", href: "/subscription" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b h-12 md:h-16",
          isScrolled ? (theme === "dark" ? "glass-dark" : "glass") : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-12 md:h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-3 md:mr-6 flex items-center space-x-2 md:space-x-3">
                <Image
                  src="/luo-ancient-logo.png"
                  alt="Luo Ancient Movies"
                  width={32}
                  height={32}
                  className="rounded-full md:w-10 md:h-10"
                />
                <h1 className="text-lg md:text-2xl lg:text-3xl font-serif font-bold tracking-wider">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark">
                    LUO ANCIENT
                  </span>
                </h1>
              </Link>

              <nav className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <GlobalSearch 
                placeholder="Search movies, series..." 
                className="w-60"
              />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="User account">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <span>Welcome, {user.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/watch-history">Watch History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/subscription">My Subscription</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              <Button variant="ghost" size="icon" aria-label="Continue watching" asChild>
                <Link href="/continue-watching">
                  <Play className="h-5 w-5" />
                </Link>
              </Button>

              <ModeToggle />
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Continue watching" asChild>
                <Link href="/continue-watching">
                  <Play className="h-4 w-4" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={cn("fixed inset-0 z-50 pt-12 md:hidden", theme === "dark" ? "glass-dark" : "glass")}>
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <GlobalSearch 
                placeholder="Search movies, series..." 
                className="w-full"
              />
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                    pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/watch-history"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Watch History
                  </Link>
                  <Link
                    href="/subscription"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Subscription
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md text-left"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary p-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <div className="pt-2 flex justify-between items-center">
                <ModeToggle />
                <Button variant="outline" size="sm" onClick={() => setIsMenuOpen(false)}>
                  Close Menu
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
