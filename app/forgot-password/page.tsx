"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiteLogo } from "@/components/site-logo"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { forgotPassword, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await forgotPassword(email)
    if (success) {
      setIsEmailSent(true)
    }
  }

  const handleResendEmail = async () => {
    const success = await forgotPassword(email)
    if (success) {
      toast({
        title: "Email resent",
        description: "Password reset email has been sent again",
      })
    }
  }

  if (isEmailSent) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="container max-w-md mx-auto">
            <Card className="glass dark:glass-dark">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent password reset instructions to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <Button
                    variant="link"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="p-0 h-auto"
                  >
                    resend the email
                  </Button>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => {
                      setIsEmailSent(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Try Different Email
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-8">
            <SiteLogo />
          </div>

          <Card className="glass dark:glass-dark">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <Button asChild variant="link" className="text-sm">
                    <Link href="/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>
              Remember your password?{" "}
              <Button asChild variant="link" className="p-0 h-auto">
                <Link href="/login">Sign in here</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
