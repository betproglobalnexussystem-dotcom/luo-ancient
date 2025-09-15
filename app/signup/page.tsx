"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page since we have combined login/signup
    router.push("/login")
  }, [router])

  return null
}
