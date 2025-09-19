"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Phone, Clock, CheckCircle, AlertCircle, Users, Shield } from "lucide-react"
import Link from "next/link"

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "24/7",
    responseTime: "Instant",
    status: "available",
    action: "Start Chat"
  },
  {
    title: "Email Support",
    description: "Send us a detailed message and we'll respond quickly",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 2 hours",
    status: "available",
    action: "Send Email"
  },
  {
    title: "WhatsApp Support",
    description: "Chat with us on WhatsApp for quick assistance",
    icon: Phone,
    availability: "24/7",
    responseTime: "< 30 minutes",
    status: "available",
    action: "WhatsApp Chat"
  }
]

const commonIssues = [
  {
    title: "Login Problems",
    description: "Having trouble signing in to your account?",
    solutions: [
      "Reset your password using the forgot password link",
      "Check if your email is correct",
      "Clear your browser cache and cookies",
      "Try using a different browser or incognito mode"
    ],
    category: "Account"
  },
  {
    title: "Video Playback Issues",
    description: "Videos not playing or buffering problems?",
    solutions: [
      "Check your internet connection speed",
      "Try refreshing the page",
      "Clear your browser cache",
      "Update your browser to the latest version",
      "Disable browser extensions temporarily"
    ],
    category: "Technical"
  },
  {
    title: "Payment Problems",
    description: "Issues with subscription payments or billing?",
    solutions: [
      "Verify your payment method is valid",
      "Check if you have sufficient funds",
      "Contact your bank if payment is declined",
      "Try using a different payment method",
      "Check your subscription status in account settings"
    ],
    category: "Billing"
  },
  {
    title: "Mobile App Issues",
    description: "Problems with the mobile app?",
    solutions: [
      "Update the app to the latest version",
      "Restart the app completely",
      "Check your device storage space",
      "Reinstall the app if problems persist",
      "Ensure your device meets minimum requirements"
    ],
    category: "Mobile"
  }
]

const supportStats = [
  { label: "Average Response Time", value: "< 2 hours", icon: Clock },
  { label: "Customer Satisfaction", value: "98%", icon: CheckCircle },
  { label: "Support Team Size", value: "15+ Agents", icon: Users },
  { label: "Uptime Guarantee", value: "99.9%", icon: Shield }
]

export default function CustomerServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customer Service</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're here to help you with any questions or issues you may have
        </p>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {supportStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Channels */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Get Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportChannels.map((channel) => (
            <Card key={channel.title} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <channel.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{channel.title}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={channel.status === "available" ? "default" : "secondary"}>
                    {channel.status === "available" ? "Available" : "Busy"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>{channel.availability}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span>{channel.responseTime}</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Common Issues */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Common Issues & Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonIssues.map((issue, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                  <Badge variant="outline">{issue.category}</Badge>
                </div>
                <CardDescription>{issue.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {issue.solutions.map((solution, solutionIndex) => (
                    <li key={solutionIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">Emergency Support</CardTitle>
          </div>
          <CardDescription>
            For urgent issues that require immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">WhatsApp Emergency Line</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Available 24/7 for critical issues
              </p>
              <Button variant="destructive" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                0789096965
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Emergency</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Mark subject as "URGENT" for priority response
              </p>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                lightstarecord@gmail.com
              </Button>
            </div>
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






