import { SiteHeader } from "@/components/site-header"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown } from "lucide-react"

export default function WomenCategoryPage() {
  // Product data for women's category
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
      id: "2",
      name: "Teal Floral Wrap Dress",
      price: 165000,
      image: "/images/dress-teal.png",
      category: "Women's Dresses",
      productCode: "413219",
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
      id: "7",
      name: "White Elegant Pantsuit",
      price: 210000,
      image: "/images/white-suit.png",
      category: "Women's Formal Wear",
      productCode: "BA.K4.178",
    },
    {
      id: "8",
      name: "Elegant Floral Maxi Dress - Green",
      price: 185000,
      image: "/images/dress-green.png",
      category: "Women's Dresses",
      productCode: "436461",
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
      id: "10",
      name: "Navy Pleated Double-Breasted Dress",
      price: 195000,
      image: "/images/navy-dress.png",
      category: "Women's Formal Wear",
      productCode: "KAN0:176",
    },
    {
      id: "11",
      name: "Elegant Evening Gown",
      price: 250000,
      image: "/images/dress-yellow.png",
      category: "Women's Formal Wear",
      productCode: "EV2022",
    },
    {
      id: "12",
      name: "Casual Summer Dress",
      price: 120000,
      image: "/images/dress-teal.png",
      category: "Women's Casual Wear",
      productCode: "CS1245",
    },
    {
      id: "13",
      name: "Designer Silk Kaftan",
      price: 230000,
      image: "/images/kaftan-colorful.png",
      category: "Women's Luxury",
      productCode: "DK7890",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Women's Collection</h1>

          {/* Filter and Sort Bar */}
          <div className="flex justify-between items-center mb-6 sticky top-16 z-10 glass dark:glass-dark p-3 rounded-lg">
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

          {/* Products Grid - 7 per row on extra large screens */}
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
