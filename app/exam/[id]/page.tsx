"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, BookOpen } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Question {
  id: string
  type: "mcq" | "descriptive"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

interface ExamData {
  id: string
  title: string
  subject: string
  duration: number
  totalQuestions: number
  questions: Question[]
}

export default function ExamPage() {
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [examStarted, setExamStarted] = useState(false)
  const router = useRouter()
  const params = useParams()

  // Mock exam data
  useEffect(() => {
    const mockExam: ExamData = {
      id: params.id as string,
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      duration: 120,
      totalQuestions: 10,
      questions: [
        {
          id: "1",
          type: "mcq",
          question: "What is the derivative of x²?",
          options: ["2x", "x²", "2", "x"],
          correctAnswer: "2x",
          points: 2,
        },
        {
          id: "2",
          type: "mcq",
          question: "What is the integral of 2x?",
          options: ["x²", "x² + C", "2", "2x + C"],
          correctAnswer: "x² + C",
          points: 2,
        },
        {
          id: "3",
          type: "descriptive",
          question: "Explain the fundamental theorem of calculus and provide an example.",
          points: 5,
        },
        {
          id: "4",
          type: "mcq",
          question: "What is the limit of (sin x)/x as x approaches 0?",
          options: ["0", "1", "∞", "undefined"],
          correctAnswer: "1",
          points: 3,
        },
        {
          id: "5",
          type: "mcq",
          question: "Which of the following is a prime number?",
          options: ["15", "21", "17", "25"],
          correctAnswer: "17",
          points: 1,
        },
      ],
    }
    setExamData(mockExam)
    setTimeLeft(mockExam.duration * 60) // Convert to seconds
  }, [params.id])

  // Timer effect
  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examStarted, timeLeft])

  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (examData?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleFlagQuestion = () => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion)
      } else {
        newSet.add(currentQuestion)
      }
      return newSet
    })
  }

  const handleSubmitExam = useCallback(() => {
    // Save answers and redirect to results
    localStorage.setItem(
      "examAnswers",
      JSON.stringify({
        examId: params.id,
        answers,
        submittedAt: new Date().toISOString(),
      }),
    )
    router.push(`/results/${params.id}`)
  }, [answers, params.id, router])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getQuestionStatus = (index: number) => {
    const question = examData?.questions[index]
    if (!question) return "unanswered"

    const hasAnswer = answers[question.id]
    if (flaggedQuestions.has(index)) {
      return hasAnswer ? "flagged-answered" : "flagged"
    }
    return hasAnswer ? "answered" : "unanswered"
  }

  const answeredCount = examData?.questions.filter((q) => answers[q.id]).length || 0
  const progress = examData ? (answeredCount / examData.questions.length) * 100 : 0

  if (!examData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{examData.title}</CardTitle>
            <CardDescription>{examData.subject}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold">Duration</p>
                <p className="text-sm text-gray-600">{examData.duration} minutes</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">Questions</p>
                <p className="text-sm text-gray-600">{examData.totalQuestions} questions</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions using the navigation buttons</li>
                <li>• Flag questions you want to review later</li>
                <li>• The exam will auto-submit when time expires</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>

            <Button onClick={handleStartExam} className="w-full" size="lg">
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = examData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{examData.title}</h1>
              <p className="text-sm text-gray-500">{examData.subject}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? "text-red-600" : "text-gray-900"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button variant="destructive" onClick={() => setShowSubmitDialog(true)}>
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm">Question Navigation</CardTitle>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-600">
                  {answeredCount} of {examData.questions.length} answered
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {examData.questions.map((_, index) => {
                    const status = getQuestionStatus(index)
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`
                          w-8 h-8 rounded text-xs font-medium border-2 transition-colors
                          ${currentQuestion === index ? "ring-2 ring-blue-500" : ""}
                          ${status === "answered" ? "bg-green-100 border-green-500 text-green-700" : ""}
                          ${status === "flagged" ? "bg-yellow-100 border-yellow-500 text-yellow-700" : ""}
                          ${status === "flagged-answered" ? "bg-orange-100 border-orange-500 text-orange-700" : ""}
                          ${status === "unanswered" ? "bg-gray-100 border-gray-300 text-gray-600" : ""}
                        `}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-500 rounded"></div>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Question {currentQuestion + 1} of {examData.questions.length}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{currentQ.type.toUpperCase()}</Badge>
                      <Badge variant="secondary">{currentQ.points} points</Badge>
                      {flaggedQuestions.has(currentQuestion) && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFlagQuestion}
                    className={flaggedQuestions.has(currentQuestion) ? "text-yellow-600 border-yellow-600" : ""}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {flaggedQuestions.has(currentQuestion) ? "Unflag" : "Flag"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg">{currentQ.question}</p>
                </div>

                {currentQ.type === "mcq" && currentQ.options && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                  >
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === "descriptive" && (
                  <div className="space-y-2">
                    <Label htmlFor="descriptive-answer">Your Answer:</Label>
                    <Textarea
                      id="descriptive-answer"
                      placeholder="Type your answer here..."
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {examData.questions.length}
                  </div>

                  <Button onClick={handleNextQuestion} disabled={currentQuestion === examData.questions.length - 1}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Submit Exam</span>
              </CardTitle>
              <CardDescription>
                Are you sure you want to submit your exam? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p>
                  • Answered: {answeredCount} of {examData.questions.length} questions
                </p>
                <p>• Time remaining: {formatTime(timeLeft)}</p>
                <p>• Flagged questions: {flaggedQuestions.size}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">
                  Continue Exam
                </Button>
                <Button onClick={handleSubmitExam} className="flex-1">
                  Submit Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
