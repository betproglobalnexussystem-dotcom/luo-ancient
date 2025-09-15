import Link from "next/link"
import { cn } from "@/lib/utils"

interface SiteLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SiteLogo({ className, size = "md" }: SiteLogoProps) {
  const sizes = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-5xl",
  }

  return (
    <Link href="/" className={cn("block", className)}>
      <h1 className={cn("font-serif font-bold tracking-wider", sizes[size])}>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark">
          LUO ANCIENT
        </span>
        <span className="text-primary ml-2">MOVIES</span>
      </h1>
    </Link>
  )
}
