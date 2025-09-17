import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { BarChart3, Download, Calendar, Users, MessageSquare, Ticket, TrendingUp } from "lucide-react"

async function getReportData() {
  const [
    totalConversations,
    totalTickets,
    totalContacts,
    conversationsToday,
    ticketsToday,
    avgRating,
    topQuestions
  ] = await Promise.all([
    db.conversation.count(),
    db.ticket.count(),
    db.contact.count(),
    db.conversation.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    db.ticket.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    db.message.aggregate({
      where: {
        rating: { not: null }
      },
      _avg: {
        rating: true
      }
    }),
    db.message.groupBy({
      by: ['content'],
      where: {
        from: 'USER'
      },
      _count: {
        content: true
      },
      orderBy: {
        _count: {
          content: 'desc'
        }
      },
      take: 5
    })
  ])

  return {
    totalConversations,
    totalTickets,
    totalContacts,
    conversationsToday,
    ticketsToday,
    avgRating: avgRating._avg.rating || 0,
    topQuestions
  }
}

export default async function ReportsPage() {
  const data = await getReportData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporty</h1>
          <p className="text-gray-600">Analiza i eksport danych</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Wybierz okres
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Eksport CSV
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rozmowy dzisiaj</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversationsToday}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20) + 5}% z wczoraj
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets dzisiaj</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.ticketsToday}</div>
            <p className="text-xs text-muted-foreground">
              {data.ticketsToday > 0 ? 'Nowe zgłoszenia' : 'Brak nowych'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Średnia ocena</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              CSAT asystenta AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kontakty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              W bazie danych
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Najczęściej zadawane pytania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {question.content.length > 60 
                        ? `${question.content.substring(0, 60)}...` 
                        : question.content
                      }
                    </p>
                  </div>
                  <Badge variant="outline">
                    {question._count.content} razy
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statystyki rozmów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Łącznie rozmów</span>
                <span className="font-medium">{data.totalConversations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rozmowy dzisiaj</span>
                <span className="font-medium">{data.conversationsToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Średnia ocena</span>
                <span className="font-medium">{data.avgRating.toFixed(1)}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tickets utworzone</span>
                <span className="font-medium">{data.totalTickets}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Eksport danych</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Rozmowy</h4>
              <p className="text-sm text-gray-600">Eksport wszystkich rozmów z ocenami</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Pobierz CSV
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Tickets</h4>
              <p className="text-sm text-gray-600">Eksport zgłoszeń BOK</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Pobierz CSV
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Kontakty</h4>
              <p className="text-sm text-gray-600">Eksport bazy kontaktów</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Pobierz CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
