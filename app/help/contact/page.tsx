"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, AlertCircle, CheckCircle, User, Mail as MailIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const contactMethods = [
  {
    title: "Email Support",
    description: "Send us a detailed message and we'll respond within 2 hours",
    icon: Mail,
    contact: "lightstarecord@gmail.com",
    availability: "24/7",
    responseTime: "< 2 hours",
    action: "Send Email"
  },
  {
    title: "WhatsApp Support",
    description: "Chat with us directly on WhatsApp for quick assistance",
    icon: MessageCircle,
    contact: "0789096965",
    availability: "24/7",
    responseTime: "< 30 minutes",
    action: "WhatsApp Chat"
  },
  {
    title: "Phone Support",
    description: "Call us for immediate assistance with urgent issues",
    icon: Phone,
    contact: "0789096965",
    availability: "24/7",
    responseTime: "Immediate",
    action: "Call Now"
  }
]

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "billing", label: "Billing & Payments" },
  { value: "account", label: "Account Issues" },
  { value: "subscription", label: "Subscription Management" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "other", label: "Other" }
]

const officeHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 10:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 8:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 6:00 PM" }
]

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    inquiryType: "",
    message: "",
    priority: "normal"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully!",
      description: "We've received your message and will respond within 2 hours.",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      inquiryType: "",
      message: "",
      priority: "normal"
    })
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12 md:mt-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our support team. We're here to help with any questions or concerns.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <method.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-primary">{method.contact}</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Available:</span>
                    <span>{method.availability}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Response:</span>
                    <span>{method.responseTime}</span>
                  </div>
                  <Button className="w-full" variant="outline">
                    {method.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Inquiry Type *</Label>
                  <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General questions</SelectItem>
                      <SelectItem value="normal">Normal - Standard support</SelectItem>
                      <SelectItem value="high">High - Urgent issues</SelectItem>
                      <SelectItem value="urgent">Urgent - Critical problems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide detailed information about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          
          {/* Office Hours */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Office Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Emergency support available 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Luo Ancient Movies</h4>
                  <p className="text-sm text-muted-foreground">
                    Your premier destination for Luo cultural entertainment and movies.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">lightstarecord@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+256 789 096 965</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
              <CardDescription>How quickly we respond to different types of inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Urgent Issues</span>
                  </div>
                  <Badge variant="destructive">Within 30 minutes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">High Priority</span>
                  </div>
                  <Badge variant="secondary">Within 2 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Normal Priority</span>
                  </div>
                  <Badge variant="outline">Within 24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">General Inquiries</span>
                  </div>
                  <Badge variant="outline">Within 48 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="mt-12 border-destructive/20 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">Emergency Support</CardTitle>
          </div>
          <CardDescription>
            For critical issues that require immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">WhatsApp Emergency</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Available 24/7 for urgent technical issues or account problems
              </p>
              <Button variant="destructive" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp: 0789096965
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Emergency</h4>
              <p className="text-sm text-muted-foreground mb-3">
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





