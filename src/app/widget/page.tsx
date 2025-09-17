"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, X, ThumbsUp, ThumbsDown } from "lucide-react"

interface Message {
  id: string
  content: string
  from: 'user' | 'bot'
  timestamp: Date
  rating?: number
}

interface ChatResponse {
  success: boolean
  data?: {
    conversationId: string
    userMessage: Message
    botMessage: Message
    context: Array<{
      id: string
      content: string
      articleTitle: string
    }>
  }
  error?: string
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [clubName, setClubName] = useState("Widzew Łódź")
  const [primaryColor, setPrimaryColor] = useState("#AD180F")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const club = urlParams.get('club')
    const color = urlParams.get('color')
    
    if (club) setClubName(decodeURIComponent(club))
    if (color) setPrimaryColor(decodeURIComponent(color))

    // Send ready message to parent
    window.parent.postMessage({ type: 'widget-ready' }, '*')

    // Add welcome message
    setMessages([{
      id: 'welcome',
      content: `Cześć! Jestem asystentem AI klubu ${clubName}. Jak mogę Ci pomóc?`,
      from: 'bot',
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      from: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId,
        }),
      })

      const data: ChatResponse = await response.json()

      if (data.success && data.data) {
        setConversationId(data.data.conversationId)
        setMessages(prev => [
          ...prev,
          {
            id: data.data!.botMessage.id,
            content: data.data!.botMessage.content,
            from: 'bot',
            timestamp: new Date(data.data!.botMessage.createdAt)
          }
        ])
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
          from: 'bot',
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Przepraszam, wystąpił błąd. Spróbuj ponownie.",
        from: 'bot',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const rateMessage = async (messageId: string, rating: number) => {
    try {
      await fetch('/api/chat/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          rating,
        }),
      })
    } catch (error) {
      console.error('Rating error:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_%C5%81%C3%B3d%C5%BA.png" 
              alt="Widzew Łódź" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{clubName}</h3>
            <p className="text-white/80 text-xs">Asystent AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.parent.postMessage({ type: 'close-widget' }, '*')}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.from === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.from === 'bot' && (
                <div className="flex items-center space-x-1 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => rateMessage(message.id, 1)}
                    className="h-6 w-6 p-0 hover:bg-green-100"
                  >
                    <ThumbsUp className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => rateMessage(message.id, -1)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                  >
                    <ThumbsDown className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{ backgroundColor: primaryColor }}
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Widzew CRM AI
        </p>
      </div>
    </div>
  )
}
