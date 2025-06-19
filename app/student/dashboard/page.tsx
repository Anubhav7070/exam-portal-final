"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Award, BookOpen, User, LogOut, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface Exam {
  id: string
  title: string
  subject: string
  duration: number
  totalQuestions: number
  scheduledDate: string
  status: "upcoming" | "completed" | "in-progress"
  score?: number
  maxScore?: number
}

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/")
      return
    }

    setUser(parsedUser)

    // Mock exam data
    setExams([
      {
        id: "1",
        title: "Mathematics Final Exam",
        subject: "Mathematics",
        duration: 120,
        totalQuestions: 50,
        scheduledDate: "2024-01-15T10:00:00",
        status: "upcoming",
      },
      {
        id: "2",
        title: "Physics Quiz",
        subject: "Physics",
        duration: 60,
        totalQuestions: 25,
        scheduledDate: "2024-01-10T14:00:00",
        status: "completed",
        score: 85,
        maxScore: 100,
      },
      {
        id: "3",
        title: "Chemistry Test",
        subject: "Chemistry",
        duration: 90,
        totalQuestions: 40,
        scheduledDate: "2024-01-12T09:00:00",
        status: "completed",
        score: 92,
        maxScore: 100,
      },
      {
        id: "4",
        title: "Biology Assessment",
        subject: "Biology",
        duration: 75,
        totalQuestions: 30,
        scheduledDate: "2024-01-18T11:00:00",
        status: "upcoming",
      },
    ])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const startExam = (examId: string) => {
    router.push(`/exam/${examId}`)
  }

  const viewResults = (examId: string) => {
    router.push(`/results/${examId}`)
  }

  const upcomingExams = exams.filter((exam) => exam.status === "upcoming")
  const completedExams = exams.filter((exam) => exam.status === "completed")
  const averageScore =
    completedExams.length > 0
      ? completedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / completedExams.length
      : 0

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedExams.length}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Exams</span>
              </CardTitle>
              <CardDescription>Exams scheduled for the coming days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingExams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming exams</p>
              ) : (
                upcomingExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-600">{exam.subject}</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{exam.totalQuestions} questions</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {new Date(exam.scheduledDate).toLocaleDateString()} at{" "}
                        {new Date(exam.scheduledDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <Button size="sm" onClick={() => startExam(exam.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Exam
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Results</span>
              </CardTitle>
              <CardDescription>Your performance in completed exams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedExams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No completed exams yet</p>
              ) : (
                completedExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                        <p className="text-sm text-gray-600">{exam.subject}</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Score</span>
                        <span className="font-semibold">{exam.score}%</span>
                      </div>
                      <Progress value={exam.score} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Completed on {new Date(exam.scheduledDate).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => viewResults(exam.id)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
