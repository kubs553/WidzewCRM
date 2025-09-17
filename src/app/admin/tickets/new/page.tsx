"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewTicketPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "MEDIUM",
    status: "NEW",
    contactEmail: "",
    contactPhone: "",
    contactName: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Ticket został utworzony pomyślnie!")
        router.push('/admin/tickets')
      } else {
        const error = await response.json()
        toast.error(error.message || "Wystąpił błąd podczas tworzenia ticketu")
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error("Wystąpił błąd podczas tworzenia ticketu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy ticket</h1>
          <p className="text-gray-600">Utwórz nowe zgłoszenie BOK</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o zgłoszeniu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Temat *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Krótki opis problemu"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorytet</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz priorytet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Niski</SelectItem>
                    <SelectItem value="MEDIUM">Średni</SelectItem>
                    <SelectItem value="HIGH">Wysoki</SelectItem>
                    <SelectItem value="URGENT">Pilny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis problemu *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Szczegółowy opis problemu lub pytania..."
                rows={6}
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Informacje o kontakcie</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Imię i nazwisko</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">E-mail</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="jan@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefon</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/tickets">
                <Button variant="outline" type="button">
                  Anuluj
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Tworzenie..." : "Utwórz ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
