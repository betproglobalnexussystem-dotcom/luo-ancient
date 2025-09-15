"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle, CreditCard, FileText, Mail, Phone, Clock, Users } from "lucide-react"

const helpSections = [
  {
    title: "Customer Service",
    description: "Get help with your account, billing, and technical issues",
    icon: MessageCircle,
    href: "/help/customer-service",
    features: ["24/7 Support", "Live Chat", "Email Support", "Phone Support"]
  },
  {
    title: "Subscription Plans",
    description: "Learn about our subscription options and pricing",
    icon: CreditCard,
    href: "/help/subscription-plans",
    features: ["Plan Comparison", "Pricing Details", "Billing Info", "Upgrade/Downgrade"]
  },
  {
    title: "FAQ",
    description: "Find answers to frequently asked questions",
    icon: FileText,
    href: "/help/faq",
    features: ["Common Questions", "Troubleshooting", "Account Issues", "Technical Help"]
  },
  {
    title: "Contact Us",
    description: "Get in touch with our support team",
    icon: Mail,
    href: "/help/contact",
    features: ["Contact Form", "Support Hours", "Response Time", "Multiple Channels"]
  }
]

const quickActions = [
  {
    title: "Reset Password",
    description: "Forgot your password? Reset it quickly",
    href: "/reset-password",
    icon: HelpCircle
  },
  {
    title: "Account Settings",
    description: "Manage your account preferences",
    href: "/account",
    icon: Users
  },
  {
    title: "Subscription Management",
    description: "View and manage your subscription",
    href: "/subscription",
    icon: CreditCard
  }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers, get support, and make the most of your Luo Ancient Movies experience
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Help Sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Help Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <section.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {section.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Need Immediate Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-sm text-muted-foreground">lightstarecord@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">0789096965</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Support Hours</h3>
              <p className="text-sm text-muted-foreground">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





