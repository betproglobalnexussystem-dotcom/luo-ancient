"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingBag, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

export default function ProductPage() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const productId = "n11"
  const inWishlist = isInWishlist(productId)

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Product data
  const product = {
    id: "n11",
    name: "Colorful Printed Kaftan - YLD3",
    price: 195000,
    image: "/images/colorful-kaftan-yld3.png",
    category: "Women's Dresses",
    productCode: "YLD3-2023-K1",
    description:
      "Make a bold statement with this vibrant, colorful printed kaftan by YLD3. This eye-catching piece features a stunning mix of colors in an abstract pattern that's sure to turn heads. The loose, flowing design offers both comfort and style, making it perfect for various occasions from casual outings to special events.",
    sizes: ["Free Size", "Plus Size"],
    colors: ["Multicolor"],
    rating: 4.8,
    reviewCount: 24,
  }

  // Related products
  const relatedProducts = [
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
      id: "n7",
      name: "Multicolor Belted Maxi Dress",
      price: 320000,
      image: "/images/multicolor-maxi-dress.png",
      category: "Women's Dresses",
      productCode: "MCMD-2023",
      isNew: true,
    },
    {
      id: "n12",
      name: "Green Pleated Maxi Dress",
      price: 280000,
      image: "/images/green-pleated-maxi.png",
      category: "Women's Dresses",
      productCode: "YLD-2023-G1",
      isNew: true,
    },
  ]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      productCode: product.productCode,
      quantity: quantity,
    })
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        productCode: product.productCode,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="lg:w-1/2">
              <div className="glass dark:glass-dark rounded-xl overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="glass dark:glass-dark rounded-lg overflow-hidden cursor-pointer">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2">
              <div className="glass dark:glass-dark rounded-xl p-6">
                <nav className="mb-4">
                  <ol className="flex text-sm">
                    <li className="text-muted-foreground">
                      <Link href="/" className="hover:text-primary">
                        Home
                      </Link>
                    </li>
                    <li className="mx-2 text-muted-foreground">/</li>
                    <li className="text-muted-foreground">
                      <Link href="/category/women" className="hover:text-primary">
                        Women's Collection
                      </Link>
                    </li>
                    <li className="mx-2 text-muted-foreground">/</li>
                    <li className="text-primary font-medium truncate">{product.name}</li>
                  </ol>
                </nav>

                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      inWishlist && "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
                    )}
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                  </Button>
                </div>

                {product.productCode && (
                  <p className="text-sm text-muted-foreground mb-3">Product Code: {product.productCode}</p>
                )}

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : i < product.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl font-bold">{formatUGX(product.price)}</span>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <Link href="/size-guide" className="text-sm text-primary mt-2 inline-block hover:underline">
                    Size Guide
                  </Link>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-l-full"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <div className="w-12 text-center border-y h-10 flex items-center justify-center">{quantity}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-r-full"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button size="lg" className="rounded-full flex-1 flex items-center gap-2" onClick={handleAddToCart}>
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full flex-1 flex items-center gap-2"
                    onClick={() => {
                      handleAddToCart()
                      window.location.href = "/checkout"
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                    Buy Now
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 mr-2">
                      <Image src="/images/motorcycle-icon.png" alt="Free Shipping" fill className="object-contain" />
                    </div>
                    <span className="text-sm">Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 mr-2">
                      <Image src="/images/motorcycle-icon.png" alt="Fast Delivery" fill className="object-contain" />
                    </div>
                    <span className="text-sm">Fast Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 mr-2">
                      <Image
                        src="/images/cash-delivery-icon.png"
                        alt="Cash on Delivery"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm">Cash on Delivery</span>
                  </div>
                </div>

                <Tabs defaultValue="description">
                  <TabsList className="w-full">
                    <TabsTrigger value="description" className="flex-1">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="flex-1">
                      Shipping
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex-1">
                      Payment
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="text-sm text-muted-foreground leading-relaxed">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-5 mt-4 space-y-1">
                      <li>Vibrant multicolored abstract pattern</li>
                      <li>Loose, flowing design for maximum comfort</li>
                      <li>100% premium quality fabric</li>
                      <li>Perfect for casual and special occasions</li>
                      <li>Easy to care for and maintain</li>
                      <li>Versatile styling options</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="shipping" className="text-sm text-muted-foreground leading-relaxed">
                    <p>
                      Free standard shipping on all orders over UGX 100,000. Delivery typically takes 3-5 business days
                      within Kampala, and 5-7 business days for other regions in Uganda.
                    </p>
                    <p className="mt-2">
                      Express shipping available at checkout for UGX 15,000 (1-2 business days in Kampala).
                    </p>
                    <div className="mt-4 flex items-center">
                      <div className="relative h-10 w-10 mr-2">
                        <Image
                          src="/images/motorcycle-icon.png"
                          alt="Motorcycle Delivery"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p>We use motorcycle delivery for fast and efficient service within Kampala.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="payment" className="text-sm text-muted-foreground leading-relaxed">
                    <h4 className="font-medium mb-2">We accept the following payment methods:</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-20">
                          <Image
                            src="/images/mtn-logo-official.png"
                            alt="MTN Mobile Money"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium">MTN Mobile Money</h5>
                          <p>Fast and secure mobile payments</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-20">
                          <Image
                            src="/images/airtel-money-official.png"
                            alt="Airtel Money"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium">Airtel Money</h5>
                          <p>Quick and reliable mobile payments</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10">
                          <Image
                            src="/images/cash-delivery-icon.png"
                            alt="Cash on Delivery"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium">Cash on Delivery</h5>
                          <p>Pay when you receive your items</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
              {relatedProducts.map((product) => (
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
