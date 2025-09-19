"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Search, HelpCircle, CreditCard, Smartphone, Wifi, User, Shield } from "lucide-react"
import Link from "next/link"

const faqCategories = [
  { id: "account", name: "Account", icon: User, color: "bg-blue-500" },
  { id: "billing", name: "Billing", icon: CreditCard, color: "bg-green-500" },
  { id: "technical", name: "Technical", icon: Smartphone, color: "bg-purple-500" },
  { id: "streaming", name: "Streaming", icon: Wifi, color: "bg-orange-500" },
  { id: "security", name: "Security", icon: Shield, color: "bg-red-500" }
]

const faqData = [
  {
    id: 1,
    question: "How do I create an account?",
    answer: "Creating an account is easy! Click on the 'Sign Up' button on our homepage, enter your email address, create a password, and verify your email. You'll then have access to browse our content and subscribe to plans.",
    category: "account",
    tags: ["signup", "registration", "account"]
  },
  {
    id: 2,
    question: "How do I reset my password?",
    answer: "If you've forgotten your password, click 'Forgot Password' on the login page. Enter your email address and we'll send you a reset link. Follow the instructions in the email to create a new password.",
    category: "account",
    tags: ["password", "reset", "login"]
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods including Mobile Money (MTN, Airtel), Bank transfers, Credit/Debit cards, and PayPal. All payments are processed securely through our payment partners.",
    category: "billing",
    tags: ["payment", "mobile money", "cards"]
  },
  {
    id: 4,
    question: "How does the subscription billing work?",
    answer: "Subscriptions are billed automatically at the end of each billing period. You'll receive an email notification before each renewal. You can cancel anytime and keep access until your current period ends.",
    category: "billing",
    tags: ["billing", "subscription", "renewal"]
  },
  {
    id: 5,
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll keep access to all content until your current billing period ends.",
    category: "billing",
    tags: ["cancel", "subscription", "refund"]
  },
  {
    id: 6,
    question: "What devices can I use to watch content?",
    answer: "You can watch on any device with internet access including smartphones, tablets, laptops, desktop computers, and smart TVs. We support all major browsers and operating systems.",
    category: "technical",
    tags: ["devices", "compatibility", "browsers"]
  },
  {
    id: 7,
    question: "Why is my video buffering or not loading?",
    answer: "Buffering issues are usually caused by slow internet connection. Try refreshing the page, clearing your browser cache, or checking your internet speed. We recommend at least 5 Mbps for HD streaming.",
    category: "streaming",
    tags: ["buffering", "loading", "internet"]
  },
  {
    id: 8,
    question: "Can I download movies for offline viewing?",
    answer: "Yes! Offline downloads are available for most plans (1 week and above). You can download content to your mobile device and watch without an internet connection. Downloads expire after 7 days.",
    category: "streaming",
    tags: ["download", "offline", "mobile"]
  },
  {
    id: 9,
    question: "How many devices can I use simultaneously?",
    answer: "The number of simultaneous devices depends on your plan. Basic plans allow 1-2 devices, while premium plans allow up to 5 devices. Check your plan details for specific limits.",
    category: "technical",
    tags: ["devices", "simultaneous", "sharing"]
  },
  {
    id: 10,
    question: "Is my personal information secure?",
    answer: "Yes, we take security seriously. All personal information is encrypted and stored securely. We never share your data with third parties and use industry-standard security measures to protect your account.",
    category: "security",
    tags: ["privacy", "security", "data"]
  },
  {
    id: 11,
    question: "What internet speed do I need for streaming?",
    answer: "We recommend at least 5 Mbps for HD streaming and 25 Mbps for 4K content. For standard quality, 3 Mbps should be sufficient. You can adjust video quality in the player settings.",
    category: "streaming",
    tags: ["internet", "speed", "quality"]
  },
  {
    id: 12,
    question: "How do I change my subscription plan?",
    answer: "You can upgrade or downgrade your plan anytime from your account settings. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades. You'll be charged or credited accordingly.",
    category: "billing",
    tags: ["upgrade", "downgrade", "plan"]
  },
  {
    id: 13,
    question: "Can I share my account with family members?",
    answer: "Yes! Family sharing is available on 3-month, 6-month, and 1-year plans. You can share with up to 3-5 family members depending on your plan. Each member gets their own profile and viewing history.",
    category: "account",
    tags: ["family", "sharing", "profiles"]
  },
  {
    id: 14,
    question: "What should I do if I'm having trouble logging in?",
    answer: "First, check if your email and password are correct. If you're still having issues, try clearing your browser cache, using incognito mode, or resetting your password. Contact support if problems persist.",
    category: "technical",
    tags: ["login", "troubleshooting", "support"]
  },
  {
    id: 15,
    question: "Do you offer refunds?",
    answer: "We offer refunds within 7 days of purchase if you haven't used the service extensively. Refunds are processed within 5-10 business days. Contact our support team to request a refund.",
    category: "billing",
    tags: ["refund", "money back", "policy"]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about Luo Ancient Movies
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
          {faqCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredFAQs.length} Question{filteredFAQs.length !== 1 ? 's' : ''} Found
          </h2>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const isExpanded = expandedItems.includes(faq.id)
            const category = faqCategories.find(cat => cat.id === faq.category)
            
            return (
              <Card key={faq.id} className="cursor-pointer" onClick={() => toggleExpanded(faq.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {category && (
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {faq.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {filteredFAQs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all categories
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all") }}>
                View All Questions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Questions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqData.slice(0, 6).map((faq) => (
            <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toggleExpanded(faq.id)}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">
                    {faqCategories.find(cat => cat.id === faq.category)?.name}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    {expandedItems.includes(faq.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <Card className="bg-muted/50">
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/help/contact">
              <Button>
                Contact Support
              </Button>
            </Link>
            <Link href="/help/customer-service">
              <Button variant="outline">
                Customer Service
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Back to Help */}
      <div className="mt-8 text-center">
        <Link href="/help">
          <Button variant="outline">
            ← Back to Help Center
          </Button>
        </Link>
      </div>
    </div>
  )
}






