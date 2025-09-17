import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { Target, Users, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

async function getSegments() {
  return await db.segment.findMany({
    orderBy: { createdAt: "desc" }
  })
}

async function getSegmentCounts() {
  const segments = await db.segment.findMany()
  const counts = []
  
  for (const segment of segments) {
    // This is a simplified count - in a real app you'd evaluate the rules
    const count = await db.contact.count({
      where: {
        // Example rules evaluation
        OR: [
          { tags: { has: "karnetowicz" } },
          { customFields: { path: ["seasonPass"], equals: true } }
        ]
      }
    })
    counts.push({ segmentId: segment.id, count })
  }
  
  return counts
}

export default async function SegmentsPage() {
  const segments = await getSegments()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segmenty</h1>
          <p className="text-gray-600">Zarządzaj segmentacją kontaktów</p>
        </div>
        <Link href="/admin/segments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nowy segment
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>~{Math.floor(Math.random() * 100) + 10} kontaktów</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Utworzony: {new Date(segment.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    Aktywny
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Rules Preview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-700 mb-2">Reguły segmentacji</div>
                  <div className="text-sm text-gray-600">
                    {segment.rules && typeof segment.rules === 'object' ? (
                      <div className="space-y-1">
                        {Object.entries(segment.rules).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span>
                            <span className="ml-2">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>Reguły nie zostały jeszcze zdefiniowane</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/segments/${segment.id}/preview`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Podgląd kontaktów
                      </Button>
                    </Link>
                    <Link href={`/admin/broadcast?segment=${segment.id}`}>
                      <Button variant="outline" size="sm">
                        Wyślij broadcast
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/segments/${segment.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {segments.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak segmentów</h3>
              <p className="text-gray-600 text-center mb-6">
                Utwórz segmenty kontaktów, aby lepiej zarządzać komunikacją z kibicami.
              </p>
              <Link href="/admin/segments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Utwórz pierwszy segment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Predefined Segments Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sugerowane segmenty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Karnetowicze</h4>
              <p className="text-sm text-blue-700 mb-3">
                Kontakty z aktywnym karnetem sezonowym
              </p>
              <Button variant="outline" size="sm" className="text-blue-600">
                Utwórz segment
              </Button>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Nowi kibice</h4>
              <p className="text-sm text-green-700 mb-3">
                Kontakty dodane w ostatnich 30 dniach
              </p>
              <Button variant="outline" size="sm" className="text-green-600">
                Utwórz segment
              </Button>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Klienci sklepu</h4>
              <p className="text-sm text-purple-700 mb-3">
                Kontakty z historią zakupów w sklepie
              </p>
              <Button variant="outline" size="sm" className="text-purple-600">
                Utwórz segment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
