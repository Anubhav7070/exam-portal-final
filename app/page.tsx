"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, Shield, Clock, Award, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiService } from "@/lib/api"

type SignupData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
};

export default function HomePage() {
  const [loginData, setLoginData] = useState<LoginData>({ email: "" })
  const [signupData, setSignupData] = useState<SignupData>({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Add new state for OTP flows
  const [showVerify, setShowVerify] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState("")
  const [verifyStep, setVerifyStep] = useState<"none"|"signup"|"login">("none")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiService.login({
        email: loginData.email,
        password: loginData.password,
        role: loginData.role,
      })

      // Store token and user data
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))

      if (response.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // Split full name into firstName and lastName
      const [firstName, ...rest] = signupData.name.trim().split(" ")
      const lastName = rest.join(" ") || ""
      await apiService.signup({
        email: signupData.email,
        firstName,
        lastName,
        password: signupData.password,
        role: "student",
      })
      // Send verification OTP
      await apiService.sendVerificationOTP(signupData.email)
      setVerifyEmail(signupData.email)
      setShowVerify(true)
      setVerifyStep("signup")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await apiService.verifyEmail(verifyEmail, otp)
      setShowVerify(false)
      setVerifyStep("none")
      setOtp("")
      alert("Email verified! You can now log in.")
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Login flow
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await apiService.sendLoginOTP(loginEmail)
      setOtpSent(true)
      setVerifyEmail(loginEmail)
      setShowVerify(true)
      setVerifyStep("login")
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await apiService.verifyLoginOTP(verifyEmail, otp)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setShowVerify(false)
      setVerifyStep("none")
      setOtp("")
      if (response.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Check if signup form is complete
  const isSignupComplete = signupData.name && signupData.email && signupData.password
  const isLoginComplete = loginData.email && loginData.password && loginData.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Examinia</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="h-5 w-5" />
                <span>500+ Exams</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Advanced Online Exam Platform
              </h2>
              <p className="text-xl text-gray-600">
                Secure, scalable, and user-friendly examination system for educational institutions and organizations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Testing</h3>
                  <p className="text-gray-600">Advanced security features to prevent cheating</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Timed Exams</h3>
                  <p className="text-gray-600">Automatic submission and time management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-gray-600">Detailed performance reports and insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-Role</h3>
                  <p className="text-gray-600">Separate interfaces for students and admins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Sign in to your account or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    {!otpSent && !showVerify && (
                      <form onSubmit={handleSendLoginOtp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={!loginEmail || loading}>
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </form>
                    )}
                    {showVerify && verifyStep === "login" && (
                      <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-otp">Enter OTP</Label>
                          <Input
                            id="login-otp"
                            type="text"
                            placeholder="Enter the OTP sent to your email"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={!otp || loading}>
                          {loading ? "Verifying..." : "Verify & Login"}
                        </Button>
                      </form>
                    )}
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    {!showVerify && (
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={!isSignupComplete || loading}>
                          {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </form>
                    )}
                    {showVerify && verifyStep === "signup" && (
                      <form onSubmit={handleVerifyEmail} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-otp">Enter OTP</Label>
                          <Input
                            id="signup-otp"
                            type="text"
                            placeholder="Enter the OTP sent to your email"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={!otp || loading}>
                          {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
