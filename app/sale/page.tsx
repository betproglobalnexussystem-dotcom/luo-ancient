import { SiteLogo } from "@/components/site-logo"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown } from "lucide-react"

export default function SalePage() {
  // Product data for sale items
  const products = [
    {
      id: "2",
      name: "Teal Floral Wrap Dress",
      price: 120000,
      originalPrice: 165000,
      image: "/images/dress-teal.png",
      category: "Women's Dresses",
      productCode: "413219",
    },
    {
      id: "4",
      name: "Boys Burgundy Pinstripe Suit",
      price: 95000,
      originalPrice: 145000,
      image: "/images/suit-burgundy.png",
      category: "Kids' Formal Wear",
      productCode: "NO:135",
    },
    {
      id: "5",
      name: "Boys Navy Pinstripe Suit",
      price: 95000,
      originalPrice: 145000,
      image: "/images/suit-navy.png",
      category: "Kids' Formal Wear",
      productCode: "NO:135",
    },
    {
      id: "8",
      name: "Elegant Floral Maxi Dress - Green",
      price: 135000,
      originalPrice: 185000,
      image: "/images/dress-green.png",
      category: "Women's Dresses",
      productCode: "436461",
    },
    {
      id: "10",
      name: "Navy Pleated Double-Breasted Dress",
      price: 145000,
      originalPrice: 195000,
      image: "/images/navy-dress.png",
      category: "Women's Formal Wear",
      productCode: "KAN0:176",
    },
    {
      id: "12",
      name: "Casual Summer Dress",
      price: 85000,
      originalPrice: 120000,
      image: "/images/dress-teal.png",
      category: "Women's Casual Wear",
      productCode: "CS1245",
    },
    {
      id: "14",
      name: "Premium Business Suit",
      price: 220000,
      originalPrice: 280000,
      image: "/images/suit-navy.png",
      category: "Men's Formal Wear",
      productCode: "BS4567",
    },
    {
      id: "17",
      name: "Casual Linen Shirt",
      price: 65000,
      originalPrice: 85000,
      image: "/images/suit-navy.png",
      category: "Men's Casual Wear",
      productCode: "LS123",
    },
    {
      id: "19",
      name: "Slim Fit Trousers",
      price: 85000,
      originalPrice: 110000,
      image: "/images/suit-navy.png",
      category: "Men's Formal Wear",
      productCode: "TR456",
    },
    {
      id: "20",
      name: "Formal Dress Shirt",
      price: 55000,
      originalPrice: 75000,
      image: "/images/suit-navy.png",
      category: "Men's Formal Wear",
      productCode: "DS123",
    },
    {
      id: "22",
      name: "Boys Casual Set",
      price: 55000,
      originalPrice: 75000,
      image: "/images/suit-burgundy.png",
      category: "Kids' Casual Wear",
      productCode: "BCS456",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-4 text-center">
        <SiteLogo size="lg" className="mx-auto" />
      </div>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Sale Items</h1>

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
                <option>Discount %</option>
              </select>
            </div>
          </div>

          {/* Products Grid - 7 per row on extra large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                category={product.category}
                productCode={product.productCode}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
