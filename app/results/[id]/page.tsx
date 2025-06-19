"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, BarChart3, Home, Download, Share } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Question {
  id: string
  type: "mcq" | "descriptive"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
  userAnswer?: string
  isCorrect?: boolean
  earnedPoints?: number
}

interface ExamResult {
  examId: string
  examTitle: string
  subject: string
  totalQuestions: number
  totalPoints: number
  earnedPoints: number
  percentage: number
  timeTaken: string
  submittedAt: string
  questions: Question[]
  grade: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<ExamResult | null>(null)
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    // Mock result data - in real app, this would fetch from API
    const mockResult: ExamResult = {
      examId: params.id as string,
      examTitle: "Mathematics Final Exam",
      subject: "Mathematics",
      totalQuestions: 5,
      totalPoints: 13,
      earnedPoints: 10,
      percentage: 76.9,
      timeTaken: "45 minutes",
      submittedAt: new Date().toISOString(),
      grade: "B+",
      questions: [
        {
          id: "1",
          type: "mcq",
          question: "What is the derivative of x²?",
          options: ["2x", "x²", "2", "x"],
          correctAnswer: "2x",
          userAnswer: "2x",
          points: 2,
          isCorrect: true,
          earnedPoints: 2,
        },
        {
          id: "2",
          type: "mcq",
          question: "What is the integral of 2x?",
          options: ["x²", "x² + C", "2", "2x + C"],
          correctAnswer: "x² + C",
          userAnswer: "x²",
          points: 2,
          isCorrect: false,
          earnedPoints: 0,
        },
        {
          id: "3",
          type: "descriptive",
          question: "Explain the fundamental theorem of calculus and provide an example.",
          userAnswer: "The fundamental theorem of calculus connects differentiation and integration...",
          points: 5,
          isCorrect: true,
          earnedPoints: 4,
        },
        {
          id: "4",
          type: "mcq",
          question: "What is the limit of (sin x)/x as x approaches 0?",
          options: ["0", "1", "∞", "undefined"],
          correctAnswer: "1",
          userAnswer: "1",
          points: 3,
          isCorrect: true,
          earnedPoints: 3,
        },
        {
          id: "5",
          type: "mcq",
          question: "Which of the following is a prime number?",
          options: ["15", "21", "17", "25"],
          correctAnswer: "17",
          userAnswer: "21",
          points: 1,
          isCorrect: false,
          earnedPoints: 0,
        },
      ],
    }
    setResult(mockResult)
  }, [params.id])

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent work! Outstanding performance."
    if (percentage >= 80) return "Great job! Very good performance."
    if (percentage >= 70) return "Good work! Solid performance."
    if (percentage >= 60) return "Fair performance. Room for improvement."
    return "Needs improvement. Consider reviewing the material."
  }

  if (!result) {
    return <div className="flex justify-center items-center h-screen">Loading results...</div>
  }

  const correctAnswers = result.questions.filter((q) => q.isCorrect).length
  const incorrectAnswers = result.questions.filter((q) => !q.isCorrect).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Exam Results</h1>
              <p className="text-sm text-gray-500">{result.examTitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowAnswerKey(!showAnswerKey)}>
                {showAnswerKey ? "Hide" : "Show"} Answer Key
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => router.push("/student/dashboard")}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{result.percentage.toFixed(0)}%</span>
              </div>
              <CardTitle className={`text-2xl ${getGradeColor(result.percentage)}`}>Grade: {result.grade}</CardTitle>
              <CardDescription>{getPerformanceMessage(result.percentage)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {result.earnedPoints} / {result.totalPoints}
                </p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
              <Progress value={result.percentage} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Taken:</span>
                  <span className="font-medium">{result.timeTaken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="font-medium">
                    {new Date(result.submittedAt).toLocaleDateString()} at{" "}
                    {new Date(result.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{result.subject}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Question Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Review</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question-wise Performance</CardTitle>
                <CardDescription>Overview of your performance on each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.questions.map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Question {index + 1}</p>
                          <p className="text-sm text-gray-600 truncate max-w-md">{question.question}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={question.type === "mcq" ? "default" : "secondary"}>
                          {question.type.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="font-medium">
                            {question.earnedPoints} / {question.points}
                          </p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {result.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={question.type === "mcq" ? "default" : "secondary"}>
                          {question.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {question.earnedPoints} / {question.points} points
                        </Badge>
                        {question.isCorrect ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Question:</h4>
                    <p className="text-gray-700">{question.question}</p>
                  </div>

                  {question.type === "mcq" && question.options && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Options:</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 border rounded-lg ${
                              showAnswerKey && option === question.correctAnswer
                                ? "bg-green-50 border-green-300"
                                : option === question.userAnswer && !question.isCorrect
                                  ? "bg-red-50 border-red-300"
                                  : option === question.userAnswer
                                    ? "bg-blue-50 border-blue-300"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              <div className="flex items-center space-x-2">
                                {option === question.userAnswer && (
                                  <Badge variant="outline" className="text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                                {showAnswerKey && option === question.correctAnswer && (
                                  <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                    Correct Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === "descriptive" && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Your Answer:</h4>
                        <div className="p-3 bg-gray-50 border rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {question.userAnswer || "No answer provided"}
                          </p>
                        </div>
                      </div>
                      {showAnswerKey && (
                        <div>
                          <h4 className="font-medium mb-2">Feedback:</h4>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800">
                              This is a descriptive question. Your answer has been evaluated based on content accuracy,
                              explanation clarity, and completeness.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => router.push("/student/dashboard")}>
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button>Take Another Exam</Button>
        </div>
      </div>
    </div>
  )
}
