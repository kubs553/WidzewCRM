import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, User, Bot, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ConversationPageProps {
  params: {
    id: string
  }
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const conversation = await db.conversation.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      contact: true,
      user: true
    }
  })

  if (!conversation) {
    notFound()
  }

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case "web": return "Czat web"
      case "email": return "E-mail"
      default: return channel
    }
  }

  const getMessageIcon = (from: string) => {
    switch (from) {
      case "user": return <User className="h-4 w-4" />
      case "bot": return <Bot className="h-4 w-4" />
      case "contact": return <User className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getRatingIcon = (rating: number | null) => {
    if (rating === 1) return <ThumbsUp className="h-4 w-4 text-green-500" />
    if (rating === -1) return <ThumbsDown className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/conversations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Szczegóły rozmowy</h1>
          <p className="text-gray-600">ID: {conversation.id}</p>
        </div>
      </div>

      {/* Conversation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informacje o rozmowie</span>
            <Badge variant="outline">
              {getChannelLabel(conversation.channel)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Data rozpoczęcia</div>
              <div className="text-sm">{new Date(conversation.createdAt).toLocaleString('pl-PL')}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Liczba wiadomości</div>
              <div className="text-sm">{conversation.messages.length}</div>
            </div>
            {conversation.contact && (
              <div>
                <div className="text-sm font-medium text-gray-500">Kontakt</div>
                <div className="text-sm">
                  {conversation.contact.firstName} {conversation.contact.lastName}
                  {conversation.contact.email && (
                    <span className="text-gray-500"> ({conversation.contact.email})</span>
                  )}
                </div>
              </div>
            )}
            {conversation.user && (
              <div>
                <div className="text-sm font-medium text-gray-500">Agent</div>
                <div className="text-sm">{conversation.user.name}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Wiadomości</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 p-4 rounded-lg ${
                  message.from === 'bot' 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'bg-gray-50 border-l-4 border-gray-300'
                }`}
              >
                <div className="flex-shrink-0">
                  {getMessageIcon(message.from)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {message.from === 'bot' ? 'Asystent AI' : 
                         message.from === 'user' ? 'Użytkownik' : 'Kontakt'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    {message.rating && getRatingIcon(message.rating)}
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
