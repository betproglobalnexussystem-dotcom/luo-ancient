import { SiteHeader } from "@/components/site-header"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown } from "lucide-react"

export default function AllProductsPage() {
  // All products data
  const products = [
    // Women's Dresses
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
      id: "n1",
      name: "Colorful Printed Kaftan",
      price: 195000,
      image: "/images/colorful-kaftan.png",
      category: "Women's Dresses",
      productCode: "YLD3-2023",
      isNew: true,
    },
    {
      id: "n6",
      name: "Cream Formal Oversized Set",
      price: 265000,
      image: "/images/cream-formal-set.png",
      category: "Women's Formal Wear",
      productCode: "CRM-2023",
      isNew: true,
    },
    {
      id: "n7",
      name: "Multicolor Belted Maxi Dress",
      price: 320000,
      image: "/images/multicolor-maxi-dress.png",
      category: "Women's Dresses",
      productCode: "MCMD-2023",
      isNew: true,
    },
    {
      id: "n8",
      name: "Green Pleated Maxi Dress",
      price: 280000,
      image: "/images/green-belted-dress.png",
      category: "Women's Dresses",
      productCode: "GPMD-2023",
      isNew: true,
    },
    {
      id: "n9",
      name: "Green Button-Front Dress",
      price: 245000,
      image: "/images/navy-pattern-dress.png",
      category: "Women's Dresses",
      productCode: "GBFD-2023",
      isNew: true,
    },
    {
      id: "n10",
      name: "Navy & White Pattern Dress",
      price: 235000,
      image: "/images/navy-white-pattern-dress.png",
      category: "Women's Dresses",
      productCode: "NWPD-2023",
      isNew: true,
    },

    // Men's Sets
    {
      id: "n2",
      name: "Burberry Style Blue Set",
      price: 280000,
      image: "/images/burberry-blue-set.png",
      category: "Men's Sets",
      productCode: "BRB-2023",
      isNew: true,
    },
    {
      id: "n3",
      name: "Ralph Lauren Blue Set",
      price: 250000,
      image: "/images/ralph-lauren-blue-set.png",
      category: "Men's Sets",
      productCode: "RL-BLU-2023",
      isNew: true,
    },
    {
      id: "n4",
      name: "Ralph Lauren Green Set",
      price: 250000,
      image: "/images/ralph-lauren-green-set.png",
      category: "Men's Sets",
      productCode: "RL-GRN-2023",
      isNew: true,
    },
    {
      id: "n5",
      name: "Ellesse Blue Pattern Set",
      price: 220000,
      image: "/images/ellesse-blue-set.png",
      category: "Men's Sets",
      productCode: "ELS-2023",
      isNew: true,
    },

    // Luxury Items
    {
      id: "l1",
      name: "Chanel White Leather Sandals",
      price: 850000,
      image: "/images/chanel-white-sandals.png",
      category: "Luxury Footwear",
      productCode: "CH-S2023",
      isNew: true,
    },
    {
      id: "l2",
      name: "Louis Vuitton Monogram Kaftan",
      price: 1250000,
      image: "/images/lv-brown-kaftan.png",
      category: "Luxury Dresses",
      productCode: "LV-K2023",
      isNew: true,
    },
    {
      id: "l4",
      name: "Versace Black Medusa Slides",
      price: 450000,
      image: "/images/versace-black-slides.png",
      category: "Luxury Footwear",
      productCode: "VS-BLK-2023",
    },
    {
      id: "l5",
      name: "Versace Gold Medusa Slides",
      price: 480000,
      image: "/images/versace-gold-slides.png",
      category: "Luxury Footwear",
      productCode: "VS-GLD-2023",
      isNew: true,
    },
    {
      id: "l7",
      name: "Nike Air Max 270 White Gold",
      price: 380000,
      image: "/images/nike-air-max.png",
      category: "Luxury Sneakers",
      productCode: "NK-AM270",
      isNew: true,
    },
    {
      id: "l8",
      name: "Gucci GG Monogram Sneakers",
      price: 650000,
      image: "/images/gucci-sneakers.png",
      category: "Luxury Sneakers",
      productCode: "GC-SNK-2023",
    },
    {
      id: "l10",
      name: "Gucci Sneaker & Tote Set",
      price: 1350000,
      image: "/images/gucci-set.png",
      category: "Luxury Sets",
      productCode: "GC-SET-2023",
      isNew: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

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
