import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"
import { Users, Search, Mail, Phone, MapPin, Calendar, Upload } from "lucide-react"
import Link from "next/link"

async function getContacts() {
  return await db.contact.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      conversations: true,
      tickets: true,
      deals: true
    }
  })
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  const getOptInColor = (optedIn: boolean) => {
    return optedIn ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getOptInLabel = (optedIn: boolean) => {
    return optedIn ? "Tak" : "Nie"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kontakty</h1>
          <p className="text-gray-600">Zarządzaj bazą kontaktów kibiców</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Link href="/admin/contacts/new">
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Nowy kontakt
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Szukaj kontaktów..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Filtry</Button>
              <Button variant="outline" size="sm">Eksport</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Grid */}
      <div className="grid gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {contact.firstName && contact.lastName
                      ? `${contact.firstName} ${contact.lastName}`
                      : contact.email || "Brak nazwiska"
                    }
                  </CardTitle>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Dodany: {new Date(contact.createdAt).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {(() => {
                    const tags = typeof contact.tags === 'string' ? JSON.parse(contact.tags) : contact.tags;
                    return tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ));
                  })()}
                  {(() => {
                    const tags = typeof contact.tags === 'string' ? JSON.parse(contact.tags) : contact.tags;
                    return tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tags.length - 3}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contact.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  )}
                  
                  {contact.city && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{contact.city}</span>
                    </div>
                  )}
                </div>

                {/* Opt-ins */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-700">E-mail</div>
                      <Badge className={getOptInColor(contact.optInEmail)}>
                        {getOptInLabel(contact.optInEmail)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">SMS</div>
                      <Badge className={getOptInColor(contact.optInSMS)}>
                        {getOptInLabel(contact.optInSMS)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-700">Push</div>
                      <Badge className={getOptInColor(contact.optInPush)}>
                        {getOptInLabel(contact.optInPush)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-4 text-sm text-center">
                    <div>
                      <div className="font-medium text-blue-700">{contact.conversations.length}</div>
                      <div className="text-blue-600">Rozmowy</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">{contact.tickets.length}</div>
                      <div className="text-blue-600">Tickets</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">{contact.deals.length}</div>
                      <div className="text-blue-600">Deals</div>
                    </div>
                  </div>
                </div>

                {/* Custom Fields */}
                {(() => {
                  const customFields = typeof contact.customFields === 'string' ? JSON.parse(contact.customFields) : contact.customFields;
                  return Object.keys(customFields).length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="font-medium text-green-700 mb-2">Dodatkowe pola</div>
                      <div className="space-y-1">
                        {Object.entries(customFields).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-green-600">{key}:</span>
                            <span className="ml-2 text-green-700">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-end">
                  <Link href={`/admin/contacts/${contact.id}`}>
                    <Button variant="outline" size="sm">
                      Zobacz szczegóły
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contacts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak kontaktów</h3>
              <p className="text-gray-600 text-center mb-6">
                Kontakty kibiców pojawią się tutaj po pierwszym kontakcie lub imporcie z CSV.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
                <Link href="/admin/contacts/new">
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Dodaj kontakt
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
