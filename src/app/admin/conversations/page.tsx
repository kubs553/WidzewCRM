import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { MessageSquare, User, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"

async function getConversations() {
  return await db.conversation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      contact: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      tickets: true
    }
  })
}

export default async function ConversationsPage() {
  const conversations = await getConversations()

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "WEB": return "bg-blue-100 text-blue-800"
      case "EMAIL": return "bg-green-100 text-green-800"
      case "SMS": return "bg-purple-100 text-purple-800"
      case "PUSH": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case "WEB": return "Web"
      case "EMAIL": return "E-mail"
      case "SMS": return "SMS"
      case "PUSH": return "Push"
      default: return channel
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rozmowy</h1>
        <p className="text-gray-600">Przegląd wszystkich rozmów z kibicami</p>
      </div>

      <div className="grid gap-6">
        {conversations.map((conversation) => (
          <Card key={conversation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg">
                      {conversation.contact?.firstName && conversation.contact?.lastName
                        ? `${conversation.contact.firstName} ${conversation.contact.lastName}`
                        : conversation.contact?.email || "Anonimowy użytkownik"
                      }
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(conversation.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{conversation.messages.length} wiadomości</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getChannelColor(conversation.channel)}>
                    {getChannelLabel(conversation.channel)}
                  </Badge>
                  {conversation.tickets.length > 0 && (
                    <Badge variant="outline">
                      {conversation.tickets.length} ticket(s)
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {conversation.messages[0] && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      {conversation.messages[0].content.length > 200
                        ? `${conversation.messages[0].content.substring(0, 200)}...`
                        : conversation.messages[0].content
                      }
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {conversation.messages[0].from === "USER" ? "Użytkownik" : "Bot"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.messages[0].createdAt).toLocaleString('pl-PL')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link href={`/admin/conversations/${conversation.id}`}>
                      <Button variant="outline" size="sm">
                        Zobacz pełną rozmowę
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {conversation.contact && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {conversation.contact.email && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{conversation.contact.email}</span>
                      </div>
                    )}
                    {conversation.contact.phone && (
                      <div className="flex items-center space-x-1">
                        <span>📞</span>
                        <span>{conversation.contact.phone}</span>
                      </div>
                    )}
                    {conversation.contact.city && (
                      <div className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>{conversation.contact.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {conversations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak rozmów</h3>
              <p className="text-gray-600 text-center">
                Rozmowy z kibicami pojawią się tutaj po pierwszym kontakcie przez czat lub e-mail.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
