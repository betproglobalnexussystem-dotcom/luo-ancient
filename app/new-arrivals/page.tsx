import { SiteLogo } from "@/components/site-logo"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown } from "lucide-react"

export default function NewArrivalsPage() {
  // Product data for new arrivals
  const products = [
    {
      id: "1",
      name: "Elegant Floral Maxi Dress - Yellow",
      price: 185000,
      image: "/images/dress-yellow.png",
      category: "Women's Dresses",
      productCode: "436461",
      isNew: true,
    },
    {
      id: "3",
      name: "Colorful Printed Kaftan",
      price: 195000,
      image: "/images/kaftan-colorful.png",
      category: "Women's Dresses",
      productCode: "F61148",
      isNew: true,
    },
    {
      id: "6",
      name: "Leopard Print Two-Piece Set",
      price: 175000,
      image: "/images/leopard-outfit.png",
      category: "Women's Sets",
      productCode: "YLD3",
      isNew: true,
    },
    {
      id: "9",
      name: "Orange LOEWE Tracksuit Set",
      price: 225000,
      image: "/images/orange-set.png",
      category: "Women's Casual Wear",
      isNew: true,
    },
    {
      id: "16",
      name: "Executive Pinstripe Suit",
      price: 350000,
      image: "/images/suit-navy.png",
      category: "Men's Formal Wear",
      productCode: "PS456",
      isNew: true,
    },
    {
      id: "18",
      name: "Designer Blazer",
      price: 195000,
      image: "/images/suit-navy.png",
      category: "Men's Formal Wear",
      productCode: "DB789",
      isNew: true,
    },
    {
      id: "21",
      name: "Girls Party Dress",
      price: 95000,
      image: "/images/dress-yellow.png",
      category: "Kids' Formal Wear",
      productCode: "GPD123",
      isNew: true,
    },
    {
      id: "23",
      name: "Girls Summer Dress",
      price: 65000,
      image: "/images/dress-teal.png",
      category: "Kids' Casual Wear",
      productCode: "GSD789",
      isNew: true,
    },
    {
      id: "26",
      name: "Luxury Evening Gown",
      price: 450000,
      image: "/images/dress-green.png",
      category: "Women's Luxury",
      productCode: "LEG123",
      isNew: true,
    },
    {
      id: "27",
      name: "Premium Silk Blouse",
      price: 120000,
      image: "/images/white-suit.png",
      category: "Women's Tops",
      productCode: "PSB456",
      isNew: true,
    },
    {
      id: "28",
      name: "Designer Kids Outfit",
      price: 135000,
      image: "/images/suit-burgundy.png",
      category: "Kids' Designer Wear",
      productCode: "DKO789",
      isNew: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-4 text-center">
        <SiteLogo size="lg" className="mx-auto" />
      </div>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-6 text-center">New Arrivals</h1>

          {/* Filter and Sort Bar */}
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 glass dark:glass-dark p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{products.length}</span> products
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="text-sm border rounded-md px-2 py-1 bg-transparent">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid - 8+ per row on extra large screens */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                productCode={product.productCode}
                isNew={product.isNew}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
