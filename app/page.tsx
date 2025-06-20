"use client"

import type React from "react"

import { useState } from "react"
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
  username: string;
  email: string;
  password: string;
  // role is not needed in the form, will be set to 'student' by default
};

type LoginData = {
  username: string;
  password: string;
  role: string;
};

export default function HomePage() {
  const [loginData, setLoginData] = useState<LoginData>({ username: "", password: "", role: "" })
  const [signupData, setSignupData] = useState<SignupData>({ name: "", username: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiService.login({
        username: loginData.username,
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
        username: signupData.username,
        firstName,
        lastName,
        email: signupData.email,
        password: signupData.password,
        role: "student", // Always student
      })

      // After successful signup, log in the user
      const loginResponse = await apiService.login({
        username: signupData.username,
        password: signupData.password,
        role: "student",
      })

      // Store token and user data
      localStorage.setItem("token", loginResponse.token)
      localStorage.setItem("user", JSON.stringify(loginResponse.user))

      if (loginResponse.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Check if signup form is complete
  const isSignupComplete = signupData.name && signupData.username && signupData.email && signupData.password
  const isLoginComplete = loginData.username && loginData.password && loginData.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ExamPortal</h1>
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
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Username</Label>
                        <Input
                          id="login-username"
                          type="text"
                          placeholder="Enter your username"
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-role">Role</Label>
                        <Select
                          value={loginData.role}
                          onValueChange={(value: string) => setLoginData({ ...loginData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={!isLoginComplete || loading}>
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-username">Username</Label>
                        <Input
                          id="signup-username"
                          type="text"
                          placeholder="Enter your username"
                          value={signupData.username}
                          onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          required
                        />
                      </div>
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
