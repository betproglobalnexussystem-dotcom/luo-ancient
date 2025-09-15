import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative h-[80vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Elevate Your Style with Linda Fashions</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Discover the latest trends and timeless classics in our new collection. Quality fashion that speaks to your
            unique style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/category/women">Shop Women</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link href="/category/men">Shop Men</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
