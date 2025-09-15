"use client"

import { cn } from "@/lib/utils"

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const inWishlist = isInWishlist(params.id)

  // Format price in Ugandan Shillings
  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Mock product data based on the ID
  // In a real app, this would come from an API or database
  const products = [
    {
      id: "1",
      name: "Elegant Floral Maxi Dress - Yellow",
      price: 185000,
      image: "/images/dress-yellow.png",
      category: "Women's Dresses",
      productCode: "436461",
      description:
        "This elegant floral maxi dress features a beautiful yellow and purple pattern with black ruffle details at the bottom. The button-down front and 3/4 sleeves make it both stylish and comfortable for any occasion.",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Yellow", "Green"],
      rating: 4.8,
      reviewCount: 24,
    },
    {
      id: "2",
      name: "Teal Floral Wrap Dress",
      price: 165000,
      image: "/images/dress-teal.png",
      category: "Women's Dresses",
      productCode: "413219",
      description:
        "A stunning teal wrap dress with vibrant floral patterns. Features a flattering silhouette with a gold belt accent and flowing design. Perfect for both casual and semi-formal occasions.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Teal", "Blue", "Red"],
      rating: 4.6,
      reviewCount: 18,
    },
    {
      id: "3",
      name: "Colorful Printed Kaftan",
      price: 195000,
      image: "/images/kaftan-colorful.png",
      category: "Women's Dresses",
      productCode: "F61148",
      description:
        "A vibrant and colorful printed kaftan featuring bold patterns in blue, pink, and orange. This loose-fitting, comfortable design is perfect for beach days or casual summer outings.",
      sizes: ["One Size"],
      colors: ["Multicolor"],
      rating: 4.9,
      reviewCount: 32,
    },
    {
      id: "4",
      name: "Boys Burgundy Pinstripe Suit",
      price: 145000,
      image: "/images/suit-burgundy.png",
      category: "Kids' Formal Wear",
      productCode: "NO:135",
      description:
        "A stylish burgundy pinstripe suit for boys featuring a double-breasted jacket and matching pants. Perfect for special occasions and formal events.",
      sizes: ["4Y", "5Y", "6Y", "7Y", "8Y"],
      colors: ["Burgundy"],
      rating: 4.7,
      reviewCount: 15,
    },
    {
      id: "5",
      name: "Boys Navy Pinstripe Suit",
      price: 145000,
      image: "/images/suit-navy.png",
      category: "Kids' Formal Wear",
      productCode: "NO:135",
      description:
        "A classic navy pinstripe suit for boys featuring a double-breasted jacket and matching pants. Perfect for special occasions and formal events.",
      sizes: ["4Y", "5Y", "6Y", "7Y", "8Y"],
      colors: ["Navy"],
      rating: 4.7,
      reviewCount: 17,
    },
    {
      id: "6",
      name: "Leopard Print Two-Piece Set",
      price: 175000,
      image: "/images/leopard-outfit.png",
      category: "Women's Sets",
      productCode: "YLD3",
      description:
        "A fashionable leopard print two-piece set featuring a button-down shirt and matching pants with denim accents. Perfect for making a bold fashion statement.",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Leopard"],
      rating: 4.5,
      reviewCount: 12,
    },
    {
      id: "7",
      name: "White Elegant Pantsuit",
      price: 210000,
      image: "/images/white-suit.png",
      category: "Women's Formal Wear",
      productCode: "BA.K4.178",
      description:
        "A sophisticated white pantsuit with ruffled sleeves and a belted waist. This elegant outfit is perfect for formal events, business meetings, or special occasions.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
      rating: 4.9,
      reviewCount: 28,
    },
    {
      id: "8",
      name: "Elegant Floral Maxi Dress - Green",
      price: 185000,
      image: "/images/dress-green.png",
      category: "Women's Dresses",
      productCode: "436461",
      description:
        "This elegant floral maxi dress features a beautiful green and floral pattern with black ruffle details at the bottom. The button-down front and 3/4 sleeves make it both stylish and comfortable for any occasion.",
      sizes: ["M", "L", "XL", "XXL"],
      colors: ["Green", "Yellow"],
      rating: 4.8,
      reviewCount: 22,
    },
    {
      id: "9",
      name: "Orange LOEWE Tracksuit Set",
      price: 225000,
      image: "/images/orange-set.png",
      category: "Women's Casual Wear",
      description:
        "A vibrant orange tracksuit set featuring the LOEWE logo on both the t-shirt and pants. This comfortable and stylish set is perfect for casual outings or lounging at home.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Orange"],
      rating: 4.7,
      reviewCount: 19,
    },
    {
      id: "10",
      name: "Navy Pleated Double-Breasted Dress",
      price: 195000,
      image: "/images/navy-dress.png",
      category: "Women's Formal Wear",
      productCode: "KAN0:176",
      description:
        "A sophisticated navy blue double-breasted dress with white pleated inserts and silver buttons. This elegant dress is perfect for formal events or professional settings.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Navy"],
      rating: 4.8,
      reviewCount: 26,
    },
  ]

  const product = products.find((p) => p.id === params.id) || products[0]

  // Mock related products - show 7 per row
  const relatedProducts = products.filter((p) => p.id !== params.id && p.category === product.category).slice(0, 7)

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
                      <Link
                        href={`/category/${product.category.toLowerCase().replace("'", "").replace(" ", "-")}`}
                        className="hover:text-primary"
                      >
                        {product.category}
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
                        className="rounded-full w-12 h-12"
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
