import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { MessageSquare, Ticket, Users, BookOpen, TrendingUp, Clock } from "lucide-react"

async function getDashboardStats() {
  const [
    totalConversations,
    totalTickets,
    totalContacts,
    totalArticles,
    recentConversations,
    recentTickets,
    ticketStats
  ] = await Promise.all([
    db.conversation.count(),
    db.ticket.count(),
    db.contact.count(),
    db.knowledgeArticle.count(),
    db.conversation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        contact: true,
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" }
        }
      }
    }),
    db.ticket.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        assignee: true,
        contact: true
      }
    }),
    db.ticket.groupBy({
      by: ["status"],
      _count: {
        status: true
      }
    })
  ])

  return {
    totalConversations,
    totalTickets,
    totalContacts,
    totalArticles,
    recentConversations,
    recentTickets,
    ticketStats
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Przegląd systemu CRM Widzew Łódź</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rozmowy</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              +12% z ostatniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets BOK</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ticketStats.find(s => s.status === "NEW")?._count.status || 0} nowych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kontakty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              +8% z ostatniego miesiąca
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artykuły wiedzy</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Baza wiedzy AI
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Ostatnie rozmowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentConversations.map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {conversation.contact?.firstName && conversation.contact?.lastName
                        ? `${conversation.contact.firstName} ${conversation.contact.lastName}`
                        : conversation.contact?.email || "Anonimowy użytkownik"
                      }
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.messages[0]?.content || "Brak wiadomości"}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(conversation.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="mr-2 h-5 w-5" />
              Ostatnie tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">
                      {ticket.contact?.firstName && ticket.contact?.lastName
                        ? `${ticket.contact.firstName} ${ticket.contact.lastName}`
                        : ticket.contact?.email || "Brak kontaktu"
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Status tickets BOK
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.ticketStats.map((stat) => (
              <div key={stat.status} className="text-center">
                <div className="text-2xl font-bold">{stat._count.status}</div>
                <div className="text-sm text-gray-600">{getStatusLabel(stat.status)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
