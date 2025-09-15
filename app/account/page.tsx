"use client"

import type React from "react"

import { useState, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { User, Package, Heart, CreditCard, LogOut, Save, Eye, EyeOff, Camera, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [avatarPreview, setAvatarPreview] = useState("")

  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Uganda")

  if (!user) {
    router.push("/login")
    return null
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        setAvatar(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Address updated",
      description: "Your address information has been updated successfully.",
    })
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">Manage your account settings and preferences</p>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <div className="glass dark:glass-dark rounded-xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-20 h-20 mb-4">
                  {avatar || avatarPreview ? (
                    <Image
                      src={avatarPreview || avatar}
                      alt="Profile Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    <Camera className="h-3 w-3 text-primary-foreground" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <h2 className="font-medium text-lg">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.subscription?.isActive && (
                  <div className="mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {user.subscription.plan} - Active
                  </div>
                )}
              </div>

              <nav className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/payment-methods"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Methods</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>

            <div className="glass dark:glass-dark rounded-xl p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                          {avatar || avatarPreview ? (
                            <Image
                              src={avatarPreview || avatar}
                              alt="Profile Avatar"
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-8 w-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="flex gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="password">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="flex gap-2">
                      <Save className="h-4 w-4" />
                      Change Password
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="address">
                  <form onSubmit={handleAddressUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07XX XXX XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                      </div>
                    </div>
                    <Button type="submit" className="flex gap-2">
                      <Save className="h-4 w-4" />
                      Save Address
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
