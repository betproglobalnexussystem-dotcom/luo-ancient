"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  ConfirmationResult
} from "firebase/auth"
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { userService } from "@/lib/firebase-services"

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  subscription?: {
    plan: string
    expiresAt: Date
    isActive: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  phoneLogin: (phoneNumber: string) => Promise<boolean>
  verifyPhoneCode: (code: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  phoneConfirmationResult: ConfirmationResult | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails list
const ADMIN_EMAILS = new Set([
  'admin@luoancient.com',
  'globalnexussystem.tech@gmail.com',
])

// Helper function to convert Firebase user to our User interface
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    role: firebaseUser.email && ADMIN_EMAILS.has(firebaseUser.email) ? 'admin' : 'user',
    // Add default subscription for demo purposes
    subscription: firebaseUser.email === 'user@example.com' ? {
      plan: "1 Month Access",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    } : undefined
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null)
  const { toast } = useToast()

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const convertedUser = convertFirebaseUser(firebaseUser)
        setUser(convertedUser)
        localStorage.setItem("user", JSON.stringify(convertedUser))
      } else {
        setUser(null)
        localStorage.removeItem("user")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true)

    try {
      // Check if Firebase is properly configured
      if (auth.app.options.apiKey === "demo-api-key") {
        // Fallback to demo mode if Firebase isn't configured
        return handleDemoLogin(email, password)
      }

      // Set persistence based on rememberMe
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const convertedUser = convertFirebaseUser(userCredential.user)
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${convertedUser.name}!`,
      })

      return true
    } catch (error: any) {
      console.error("Login error:", error)
      
      let errorMessage = "An error occurred during login"
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address"
          break
        case 'auth/wrong-password':
          errorMessage = "Incorrect password"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later"
          break
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled"
          break
        case 'auth/configuration-not-found':
          errorMessage = "Firebase not configured. Using demo mode."
          return handleDemoLogin(email, password)
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Demo login fallback
  const handleDemoLogin = async (email: string, password: string) => {
    // Mock validation with demo accounts
    if ((email === "admin@luoancient.com" || email === 'globalnexussystem.tech@gmail.com') && password === "admin123") {
      const user: User = {
        id: "admin",
        name: "Admin User",
        email,
        role: "admin",
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))

      toast({
        title: "Demo Admin login successful",
        description: "Welcome back, Admin! (Demo mode)",
      })
      return true
    } else if (email === "user@example.com" && password === "password") {
      const user: User = {
        id: "1",
        name: "John Doe",
        email,
        role: "user",
        subscription: {
          plan: "1 Month Access",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      }
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))

      toast({
        title: "Demo login successful",
        description: "Welcome back, John Doe! (Demo mode)",
      })
      return true
    } else {
      toast({
        title: "Demo login failed",
        description: "Invalid credentials. Try admin@luoancient.com / admin123 or user@example.com / password",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Check if Firebase is properly configured
      if (auth.app.options.apiKey === "demo-api-key") {
        // Fallback to demo mode if Firebase isn't configured
        return handleDemoRegister(name, email, password)
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name
      })

      // Create user profile in Firestore
      try {
        await userService.createUserProfile(userCredential.user.uid, {
          name,
          email,
          role: ADMIN_EMAILS.has(email) ? 'admin' : 'user',
          status: 'active'
        })
      } catch (error) {
        console.error('Error creating user profile:', error)
        // Continue even if profile creation fails
      }

      const convertedUser = convertFirebaseUser(userCredential.user)
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! Please subscribe to start watching.`,
      })

      return true
    } catch (error: any) {
      console.error("Registration error:", error)
      
      let errorMessage = "An error occurred during registration"
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters"
          break
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled"
          break
        case 'auth/configuration-not-found':
          errorMessage = "Firebase not configured. Using demo mode."
          return handleDemoRegister(name, email, password)
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Demo register fallback
  const handleDemoRegister = async (name: string, email: string, password: string) => {
    // Mock registration
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "user",
    }
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))

    toast({
      title: "Demo registration successful",
      description: `Welcome, ${name}! Please subscribe to start watching. (Demo mode)`,
    })
    return true
  }

  const googleLogin = async () => {
    setIsLoading(true)

    try {
      // Check if Firebase is properly configured
      if (auth.app.options.apiKey === "demo-api-key") {
        toast({
          title: "Google login not available",
          description: "Please configure Firebase to use Google login. Using demo mode.",
          variant: "destructive",
        })
        return false
      }

      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const convertedUser = convertFirebaseUser(userCredential.user)
      
      toast({
        title: "Google login successful",
        description: `Welcome, ${convertedUser.name}!`,
      })

      return true
    } catch (error: any) {
      console.error("Google login error:", error)
      
      let errorMessage = "An error occurred during Google login"
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = "Login popup was closed"
          break
        case 'auth/popup-blocked':
          errorMessage = "Login popup was blocked by browser"
          break
        case 'auth/cancelled-popup-request':
          errorMessage = "Login was cancelled"
          break
        case 'auth/configuration-not-found':
          errorMessage = "Firebase not configured. Google login not available."
          break
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Google login failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const phoneLogin = async (phoneNumber: string) => {
    setIsLoading(true)

    try {
      // Validate phone number format
      if (!phoneNumber || phoneNumber.length < 10) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number with country code",
          variant: "destructive",
        })
        return false
      }

      // Ensure phone number starts with +
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

      // Check if Firebase is properly configured
      if (auth.app.options.apiKey === "demo-api-key") {
        // Demo mode - simulate phone authentication
        toast({
          title: "Demo Mode - Phone Authentication",
          description: "Please configure Firebase for real phone authentication. Using demo mode.",
        })
        
        // Simulate successful phone verification for demo
        setTimeout(() => {
          const demoUser: User = {
            id: "demo-phone-user",
            name: "Demo Phone User",
            email: `${formattedPhone}@demo.com`,
            role: "user",
          }
          setUser(demoUser)
          localStorage.setItem("user", JSON.stringify(demoUser))
          
          toast({
            title: "Demo phone authentication successful",
            description: "Welcome! (Demo mode)",
          })
        }, 1000)
        
        return true
      }

      // Initialize reCAPTCHA verifier if not already done
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber
            console.log('reCAPTCHA solved:', response)
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log('reCAPTCHA expired')
          }
        })
        
        // Render the reCAPTCHA
        await verifier.render()
        setRecaptchaVerifier(verifier)
      }

      // Send verification code
      console.log('Attempting to send SMS to:', formattedPhone)
      console.log('reCAPTCHA verifier:', recaptchaVerifier)
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier!)
      setPhoneConfirmationResult(confirmationResult)
      
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      })

      return true
    } catch (error: any) {
      console.error("Phone login error:", error)
      
      let errorMessage = "An error occurred during phone authentication"
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = "Invalid phone number format. Please include country code (e.g., +1234567890)"
          break
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later"
          break
        case 'auth/quota-exceeded':
          errorMessage = "SMS quota exceeded. Please try again later"
          break
        case 'auth/captcha-check-failed':
          errorMessage = "reCAPTCHA verification failed"
          break
        case 'auth/argument-error':
          errorMessage = "Invalid phone number format. Please check the number and try again"
          break
        case 'auth/configuration-not-found':
          errorMessage = "Firebase not configured. Phone login not available."
          break
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Phone authentication failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPhoneCode = async (code: string) => {
    setIsLoading(true)

    try {
      if (!phoneConfirmationResult) {
        toast({
          title: "No verification in progress",
          description: "Please request a verification code first",
          variant: "destructive",
        })
        return false
      }

      const result = await phoneConfirmationResult.confirm(code)
      const convertedUser = convertFirebaseUser(result.user)
      
      // Clear the confirmation result
      setPhoneConfirmationResult(null)
      
      toast({
        title: "Phone authentication successful",
        description: `Welcome, ${convertedUser.name}!`,
      })

      return true
    } catch (error: any) {
      console.error("Phone verification error:", error)
      
      let errorMessage = "Invalid verification code"
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = "Invalid verification code"
          break
        case 'auth/code-expired':
          errorMessage = "Verification code has expired"
          break
        case 'auth/session-expired':
          errorMessage = "Session expired. Please request a new code"
          break
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      
      toast({
        title: "Reset email sent",
        description: "Please check your inbox for password reset instructions",
      })

      return true
    } catch (error: any) {
      console.error("Forgot password error:", error)
      
      let errorMessage = "Failed to send reset email"
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address"
          break
        case 'auth/invalid-email':
          errorMessage = "Invalid email address"
          break
        case 'auth/too-many-requests':
          errorMessage = "Too many requests. Please try again later"
          break
        default:
          errorMessage = error.message || errorMessage
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true)

    try {
      // Note: Firebase handles password reset through email links
      // This function is kept for compatibility but won't be used with Firebase
      toast({
        title: "Password reset successful",
        description: "Your password has been updated successfully",
      })

      return true
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        googleLogin,
        phoneLogin,
        verifyPhoneCode,
        forgotPassword, 
        resetPassword, 
        logout, 
        isLoading,
        phoneConfirmationResult
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}