import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isFeatured?: boolean
}

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  viewAllLink?: string
  className?: string
}

export function ProductSection({ title, subtitle, products, viewAllLink, className }: ProductSectionProps) {
  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>

          {viewAllLink && (
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href={viewAllLink}>View All</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
