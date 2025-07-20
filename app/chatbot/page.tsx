'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  School, 
  Home, 
  Briefcase, 
  Users, 
  MapPin,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  category?: string
}

const quickQuestions = [
  { text: "What are the hostel facilities?", category: "hostel", icon: Home },
  { text: "Tell me about placement statistics", category: "placements", icon: Briefcase },
  { text: "What courses are available?", category: "courses", icon: School },
  { text: "How do I contact faculty?", category: "faculty", icon: Users },
  { text: "Campus navigation help", category: "campus", icon: MapPin },
  { text: "Upcoming events", category: "events", icon: Calendar },
  { text: "Fee payment deadlines", category: "fees", icon: DollarSign },
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm VIT SmartBot, your friendly assistant for VIT Vellore. I can help you with hostel life, courses, placements, faculty information, and campus navigation. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text: string, category?: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      category
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Try main API first, fallback to demo API if it fails
      let response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text.trim(),
          category: category || 'general'
        }),
      })

      // If main API fails, try demo API
      if (!response.ok) {
        response = await fetch('/api/chatbot-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: text.trim(),
            category: category || 'general'
          }),
        })
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        category: data.category
      }

      // Show demo indicator if using demo mode
      if (data.demo) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          text: "ℹ️ Running in demo mode - Connect MongoDB for real-time data",
          sender: 'bot',
          timestamp: new Date(),
          category: 'system'
        }])
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing some technical difficulties. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const getCategoryColor = (category?: string) => {
    const colors = {
      hostel: 'bg-blue-100 text-blue-800',
      placements: 'bg-green-100 text-green-800',
      courses: 'bg-purple-100 text-purple-800',
      faculty: 'bg-orange-100 text-orange-800',
      campus: 'bg-pink-100 text-pink-800',
      events: 'bg-yellow-100 text-yellow-800',
      fees: 'bg-red-100 text-red-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">VIT SmartBot</h1>
          </div>
          <p className="text-gray-600 text-lg">Your intelligent assistant for VIT Vellore</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => {
                  const IconComponent = question.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => sendMessage(question.text, question.category)}
                    >
                      <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{question.text}</span>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-blue-600" />
                  Chat with VIT SmartBot
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src="/bot-avatar.png" />
                            <AvatarFallback className="bg-blue-600 text-white">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.category && (
                              <Badge 
                                className={`text-xs ${getCategoryColor(message.category)}`}
                                variant="secondary"
                              >
                                {message.category}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {message.sender === 'user' && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gray-600 text-white">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-600 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator />

                {/* Input Area */}
                <div className="p-4">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      placeholder="Ask me anything about VIT Vellore..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}