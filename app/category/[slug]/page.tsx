import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Capitalize the first letter of the category slug
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  // Mock products data - in a real app, this would come from an API or database
  const products = [
    {
      id: "1",
      name: "Elegant Summer Dress",
      price: 59.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Dresses",
      isNew: true,
    },
    {
      id: "2",
      name: "Classic Fit Shirt",
      price: 39.99,
      originalPrice: 49.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Shirts",
    },
    {
      id: "3",
      name: "Casual Denim Jacket",
      price: 79.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Outerwear",
      isNew: true,
    },
    {
      id: "4",
      name: "Slim Fit Jeans",
      price: 49.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Pants",
    },
    {
      id: "5",
      name: "Floral Print Blouse",
      price: 34.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Tops",
      isNew: true,
    },
    {
      id: "6",
      name: "Lightweight Sweater",
      price: 44.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Sweaters",
      isNew: true,
    },
    {
      id: "7",
      name: "Pleated Midi Skirt",
      price: 39.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Skirts",
      isNew: true,
    },
    {
      id: "8",
      name: "Casual Sneakers",
      price: 59.99,
      originalPrice: 69.99,
      image: "/placeholder.svg?height=500&width=500",
      category: "Footwear",
      isNew: true,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <p className="text-muted-foreground mb-8">
            Discover our collection of {categoryName.toLowerCase()} for every occasion.
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="glass dark:glass-dark rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm">
                    Clear All
                  </Button>
                </div>

                <Accordion type="multiple" defaultValue={["price", "color", "size"]}>
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider defaultValue={[20, 80]} max={100} step={1} />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">$20</span>
                          <span className="text-sm">$80</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="color">
                    <AccordionTrigger>Color</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {["Black", "White", "Red", "Blue", "Green"].map((color) => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox id={`color-${color.toLowerCase()}`} />
                            <Label htmlFor={`color-${color.toLowerCase()}`}>{color}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="size">
                    <AccordionTrigger>Size</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox id={`size-${size.toLowerCase()}`} />
                            <Label htmlFor={`size-${size.toLowerCase()}`}>{size}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {["Tops", "Dresses", "Pants", "Skirts", "Outerwear"].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={`category-${category.toLowerCase()}`} />
                            <Label htmlFor={`category-${category.toLowerCase()}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-muted-foreground">Showing {products.length} products</p>

                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <Button variant="outline" size="lg" className="rounded-full">
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
