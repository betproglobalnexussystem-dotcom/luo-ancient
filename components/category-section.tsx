import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  image: string
  href: string
}

interface CategorySectionProps {
  title: string
  categories: Category[]
  className?: string
}

export function CategorySection({ title, categories, className }: CategorySectionProps) {
  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-xl aspect-square glass dark:glass-dark"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium text-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
