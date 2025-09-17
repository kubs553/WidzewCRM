import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/db"
import { Ticket, User, Calendar, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

async function getTickets() {
  return await db.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignee: true,
      contact: true,
      conversation: true
    }
  })
}

async function getUsers() {
  return await db.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "BOK"]
      }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })
}

export default async function TicketsPage() {
  const [tickets, users] = await Promise.all([getTickets(), getUsers()])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800"
      case "PENDING": return "bg-orange-100 text-orange-800"
      case "CLOSED": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW": return "Nowe"
      case "IN_PROGRESS": return "W toku"
      case "PENDING": return "Oczekuje"
      case "CLOSED": return "Zamknięte"
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW": return "bg-green-100 text-green-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "HIGH": return "bg-orange-100 text-orange-800"
      case "URGENT": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "LOW": return "Niski"
      case "MEDIUM": return "Średni"
      case "HIGH": return "Wysoki"
      case "URGENT": return "Pilny"
      default: return priority
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets BOK</h1>
          <p className="text-gray-600">Zarządzaj zgłoszeniami od kibiców</p>
        </div>
        <Link href="/admin/tickets/new">
          <Button>
            <Ticket className="mr-2 h-4 w-4" />
            Nowy ticket
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="NEW">Nowe</SelectItem>
                  <SelectItem value="IN_PROGRESS">W toku</SelectItem>
                  <SelectItem value="PENDING">Oczekuje</SelectItem>
                  <SelectItem value="CLOSED">Zamknięte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Priorytet:</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  <SelectItem value="LOW">Niski</SelectItem>
                  <SelectItem value="MEDIUM">Średni</SelectItem>
                  <SelectItem value="HIGH">Wysoki</SelectItem>
                  <SelectItem value="URGENT">Pilny</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Przypisany:</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy</SelectItem>
                  <SelectItem value="unassigned">Nieprzypisane</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Utworzony: {new Date(ticket.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                    {ticket.updatedAt !== ticket.createdAt && (
                      <div className="flex items-center space-x-1">
                        <span>Zaktualizowany: {new Date(ticket.updatedAt).toLocaleDateString('pl-PL')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {getPriorityLabel(ticket.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Contact Info */}
                {ticket.contact && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">Kontakt</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      {ticket.contact.firstName && ticket.contact.lastName
                        ? `${ticket.contact.firstName} ${ticket.contact.lastName}`
                        : ticket.contact.email || "Brak danych"
                      }
                      {ticket.contact.email && (
                        <div className="text-gray-500">{ticket.contact.email}</div>
                      )}
                      {ticket.contact.phone && (
                        <div className="text-gray-500">{ticket.contact.phone}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Assignee */}
                {ticket.assignee && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Przypisany do</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      {ticket.assignee.name || ticket.assignee.email}
                    </div>
                  </div>
                )}

                {/* Conversation Link */}
                {ticket.conversation && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Powiązana rozmowa</span>
                    </div>
                    <Link href={`/admin/conversations/${ticket.conversation.id}`}>
                      <Button variant="outline" size="sm">
                        Zobacz rozmowę
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="flex justify-end">
                  <Link href={`/admin/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm">
                      Zobacz szczegóły
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tickets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak tickets</h3>
              <p className="text-gray-600 text-center">
                Tickets BOK pojawią się tutaj po utworzeniu zgłoszeń przez kibiców.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
