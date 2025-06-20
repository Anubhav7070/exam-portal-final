"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Calendar, BarChart3, Plus, Settings, LogOut, FileText, Clock, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiService } from '@/lib/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Student {
  id: string
  name: string
  email: string
  totalExams: number
  averageScore: number
  lastActive: string
}

interface Exam {
  id: string
  title: string
  subject: string
  duration: number
  totalQuestions: number
  scheduledDate: string
  status: "draft" | "published" | "completed"
  studentsEnrolled: number
}

interface User {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  isEmailVerified?: boolean
  isActive?: boolean
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<{ firstName?: string; lastName?: string; email?: string; role?: string }>({})
  const [editLoading, setEditLoading] = useState(false)

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

    // Mock data
    setStudents([
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        totalExams: 5,
        averageScore: 85,
        lastActive: "2024-01-10",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        totalExams: 3,
        averageScore: 92,
        lastActive: "2024-01-09",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        totalExams: 7,
        averageScore: 78,
        lastActive: "2024-01-11",
      },
    ])

    setExams([
      {
        id: "1",
        title: "Mathematics Final Exam",
        subject: "Mathematics",
        duration: 120,
        totalQuestions: 50,
        scheduledDate: "2024-01-15T10:00:00",
        status: "published",
        studentsEnrolled: 25,
      },
      {
        id: "2",
        title: "Physics Quiz",
        subject: "Physics",
        duration: 60,
        totalQuestions: 25,
        scheduledDate: "2024-01-10T14:00:00",
        status: "completed",
        studentsEnrolled: 18,
      },
      {
        id: "3",
        title: "Chemistry Test",
        subject: "Chemistry",
        duration: 90,
        totalQuestions: 40,
        scheduledDate: "2024-01-12T09:00:00",
        status: "draft",
        studentsEnrolled: 0,
      },
    ])

    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const users = await apiService.getAllUsers()
        setUsers(users)
      } catch (err) {
        // handle error
      }
    }
    fetchUsers()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const totalStudents = students.length
  const totalExams = exams.length
  const publishedExams = exams.filter((exam) => exam.status === "published").length
  const averageScore =
    students.length > 0 ? students.reduce((sum, student) => sum + student.averageScore, 0) / students.length : 0

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await apiService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  const handleEditUser = (user: User) => {
    setEditUser(user)
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'student',
    })
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm({ ...editForm, [field]: value })
  }

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setEditLoading(true)
    try {
      const { user: updated } = await apiService.updateUser(editUser.id, editForm)
      setUsers(users.map(u => u.id === updated.id ? updated : u))
      setEditUser(null)
    } catch (err) {
      alert('Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }

  const handleToggleActive = async (userId: string) => {
    try {
      await apiService.toggleUserActive(userId)
      setUsers(users => users.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u))
    } catch (err) {
      alert('Failed to toggle user active status')
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const { user: updated } = await apiService.changeUserRole(userId, newRole)
      setUsers(users.map(u => u.id === updated.id ? updated : u))
    } catch (err) {
      alert('Failed to change user role')
    }
  }

  const handleTriggerPasswordReset = async (userId: string) => {
    try {
      await apiService.triggerPasswordReset(userId)
      alert('Password reset email sent')
    } catch (err) {
      alert('Failed to send password reset email')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage exams and students</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push("/admin/create-exam")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedExams}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="exams" className="space-y-6">
          <TabsList>
            <TabsTrigger value="exams">Exam Management</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="questions">Question Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Exam Management</CardTitle>
                    <CardDescription>Create and manage your exams</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/admin/create-exam")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Exam
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                        </div>
                        <Badge
                          variant={
                            exam.status === "published"
                              ? "default"
                              : exam.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {exam.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{exam.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{exam.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{exam.studentsEnrolled} enrolled</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                        {exam.status === "draft" && <Button size="sm">Publish</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Monitor student performance and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{student.totalExams} exams taken</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>{student.averageScore}% avg score</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Last active: {new Date(student.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Question Bank</CardTitle>
                    <CardDescription>Manage your question repository</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/admin/questions")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Question bank management coming soon</p>
                  <p className="text-sm">Create and organize questions by subject and difficulty</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Management Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage all users (students and admins)</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.isEmailVerified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{u.isActive ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      {user && user.id !== u.id && (
                        <>
                          <Button size="sm" onClick={() => handleEditUser(u)}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => handleToggleActive(u.id)}>{u.isActive ? 'Deactivate' : 'Activate'}</Button>
                          <Select value={u.role} onValueChange={val => handleChangeRole(u.id, val)}>
                            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" onClick={() => handleTriggerPasswordReset(u.id)}>Reset Password</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={open => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditFormSubmit} className="space-y-4">
            <Input
              placeholder="First Name"
              value={editForm.firstName || ''}
              onChange={e => handleEditFormChange('firstName', e.target.value)}
              required
            />
            <Input
              placeholder="Last Name"
              value={editForm.lastName || ''}
              onChange={e => handleEditFormChange('lastName', e.target.value)}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={editForm.email || ''}
              onChange={e => handleEditFormChange('email', e.target.value)}
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
