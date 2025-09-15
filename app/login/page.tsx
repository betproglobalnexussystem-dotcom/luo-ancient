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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { Phone } from "lucide-react"
// Google Logo Component
const GoogleLogo = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const { login, register, googleLogin, phoneLogin, verifyPhoneCode, isLoading, phoneConfirmationResult } = useAuth()

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  // Form errors
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }

    const success = await login(loginEmail, loginPassword, rememberMe)
    if (success) {
      // Redirect admin to admin panel, others to home
      // We cannot directly access user here synchronously; do simple redirect to home and admin will have header link.
      // Alternatively, push to /admin if email matches admin list for immediate UX.
      const adminEmails = new Set(['admin@luoancient.com', 'globalnexussystem.tech@gmail.com'])
      if (adminEmails.has(loginEmail)) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    const success = await register(registerName, registerEmail, registerPassword)
    if (success) {
      router.push("/")
    }
  }

  const handleGoogleLogin = async () => {
    const success = await googleLogin()
    if (success) {
      router.push("/")
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError("")

    if (!phoneNumber) {
      setPhoneError("Please enter your phone number")
      return
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setPhoneError("Please enter a valid phone number with country code (e.g., +1234567890)")
      return
    }

    // Format phone number (add + if not present)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
    
    const success = await phoneLogin(formattedPhone)
    if (success) {
      // Don't redirect yet, wait for verification code
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError("")

    if (!verificationCode) {
      setPhoneError("Please enter the verification code")
      return
    }

    const success = await verifyPhoneCode(verificationCode)
    if (success) {
      router.push("/")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-4 text-center">
        <SiteLogo size="lg" className="mx-auto" />
      </div>
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md mx-auto px-4">
          <div className="glass dark:glass-dark rounded-xl p-6 md:p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                  </div>

                  {loginError && <div className="text-destructive text-sm">{loginError}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <GoogleLogo />
                    <span className="ml-2">Continue with Google</span>
                  </Button>

                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>

                  {registerError && <div className="text-destructive text-sm">{registerError}</div>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <GoogleLogo />
                    <span className="ml-2">Continue with Google</span>
                  </Button>

                </form>
              </TabsContent>

              <TabsContent value="phone">
                {!phoneConfirmationResult ? (
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => {
                          // Remove any non-digit characters except +
                          let value = e.target.value.replace(/[^\d+]/g, '')
                          // Ensure only one + at the beginning
                          if (value.startsWith('+')) {
                            value = '+' + value.slice(1).replace(/\+/g, '')
                          } else {
                            value = value.replace(/\+/g, '')
                          }
                          setPhoneNumber(value)
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your phone number with country code (e.g., +1234567890)
                      </p>
                    </div>

                    {phoneError && <div className="text-destructive text-sm">{phoneError}</div>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Sending code..." : "Send Verification Code"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <GoogleLogo />
                      <span className="ml-2">Continue with Google</span>
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="text-center mb-4">
                      <Phone className="h-12 w-12 text-primary mx-auto mb-2" />
                      <h3 className="text-lg font-semibold">Enter Verification Code</h3>
                      <p className="text-sm text-muted-foreground">
                        We sent a 6-digit code to {phoneNumber}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                    </div>

                    {phoneError && <div className="text-destructive text-sm">{phoneError}</div>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPhoneConfirmationResult(null)
                        setVerificationCode("")
                        setPhoneError("")
                      }}
                    >
                      Back to Phone Number
                    </Button>
                  </form>
                )}

                {/* reCAPTCHA container - hidden */}
                <div id="recaptcha-container" className="hidden"></div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
