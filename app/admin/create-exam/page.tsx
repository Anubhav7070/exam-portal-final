"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Eye, BookOpen, ArrowLeft, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  type: "mcq" | "descriptive"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

interface ExamData {
  title: string
  subject: string
  description: string
  duration: number
  scheduledDate: string
  scheduledTime: string
  instructions: string
  questions: Question[]
}

export default function CreateExamPage() {
  const [user, setUser] = useState<any>(null)
  const [examData, setExamData] = useState<ExamData>({
    title: "",
    subject: "",
    description: "",
    duration: 60,
    scheduledDate: "",
    scheduledTime: "",
    instructions: "",
    questions: [],
  })
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "mcq",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleExamDataChange = (field: keyof ExamData, value: string | number) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleQuestionChange = (field: keyof Question, value: any) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }))
  }

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) return

    const newQuestion: Question = {
      ...currentQuestion,
      id: Date.now().toString(),
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...examData.questions]
      updatedQuestions[editingIndex] = newQuestion
      setExamData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }))
      setEditingIndex(null)
    } else {
      setExamData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }))
    }

    // Reset form
    setCurrentQuestion({
      id: "",
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    })
  }

  const editQuestion = (index: number) => {
    setCurrentQuestion(examData.questions[index])
    setEditingIndex(index)
  }

  const deleteQuestion = (index: number) => {
    setExamData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }))
  }

  const saveExam = () => {
    // In a real app, this would save to a database
    console.log("Saving exam:", examData)
    alert("Exam saved successfully!")
    router.push("/admin/dashboard")
  }

  const previewExam = () => {
    // In a real app, this would open a preview modal or page
    alert("Preview functionality would open here")
  }

  const totalPoints = examData.questions.reduce((sum, q) => sum + q.points, 0)

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New Exam</h1>
                <p className="text-sm text-gray-500">Design and configure your exam</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={previewExam}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveExam}>
                <Save className="h-4 w-4 mr-2" />
                Save Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="questions">Questions ({examData.questions.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>Configure the basic information for your exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter exam title"
                      value={examData.title}
                      onChange={(e) => handleExamDataChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={examData.subject} onValueChange={(value) => handleExamDataChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam"
                    value={examData.description}
                    onChange={(e) => handleExamDataChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={examData.duration}
                      onChange={(e) => handleExamDataChange("duration", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={examData.scheduledDate}
                      onChange={(e) => handleExamDataChange("scheduledDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Scheduled Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={examData.scheduledTime}
                      onChange={(e) => handleExamDataChange("scheduledTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Enter exam instructions for students"
                    value={examData.instructions}
                    onChange={(e) => handleExamDataChange("instructions", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingIndex !== null ? "Edit Question" : "Add New Question"}</CardTitle>
                  <CardDescription>Create multiple choice or descriptive questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <RadioGroup
                      value={currentQuestion.type}
                      onValueChange={(value: "mcq" | "descriptive") => handleQuestionChange("type", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mcq" id="mcq" />
                        <Label htmlFor="mcq">Multiple Choice</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="descriptive" id="descriptive" />
                        <Label htmlFor="descriptive">Descriptive</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question-text">Question *</Label>
                    <Textarea
                      id="question-text"
                      placeholder="Enter your question"
                      value={currentQuestion.question}
                      onChange={(e) => handleQuestionChange("question", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {currentQuestion.type === "mcq" && (
                    <div className="space-y-3">
                      <Label>Options *</Label>
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                          <RadioGroup
                            value={currentQuestion.correctAnswer}
                            onValueChange={(value) => handleQuestionChange("correctAnswer", value)}
                          >
                            <RadioGroupItem value={option} id={`correct-${index}`} />
                          </RadioGroup>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">Select the radio button next to the correct answer</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="points">Points *</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={currentQuestion.points}
                      onChange={(e) => handleQuestionChange("points", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <Button onClick={addQuestion} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingIndex !== null ? "Update Question" : "Add Question"}
                  </Button>

                  {editingIndex !== null && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingIndex(null)
                        setCurrentQuestion({
                          id: "",
                          type: "mcq",
                          question: "",
                          options: ["", "", "", ""],
                          correctAnswer: "",
                          points: 1,
                        })
                      }}
                      className="w-full"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Questions ({examData.questions.length})</CardTitle>
                      <CardDescription>Total Points: {totalPoints}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {examData.questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No questions added yet</p>
                      <p className="text-sm">Add your first question to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {examData.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={question.type === "mcq" ? "default" : "secondary"}>
                                {question.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{question.points} pts</Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" onClick={() => editQuestion(index)}>
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteQuestion(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Q{index + 1}:</span> {question.question}
                          </p>
                          {question.type === "mcq" && question.options && (
                            <div className="text-xs text-gray-500">
                              <p>Options: {question.options.filter((opt) => opt.trim()).length}</p>
                              <p>Correct: {question.correctAnswer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Exam Settings</span>
                </CardTitle>
                <CardDescription>Configure advanced settings for your exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Advanced settings coming soon</p>
                  <p className="text-sm">Features like time limits per question, randomization, etc.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
