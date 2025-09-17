"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewContactPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    city: "",
    tags: [] as string[],
    optInEmail: false,
    optInSMS: false,
    optInPush: false
  })
  const [newTag, setNewTag] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Kontakt został utworzony pomyślnie!")
        router.push('/admin/contacts')
      } else {
        const error = await response.json()
        toast.error(error.message || "Wystąpił błąd podczas tworzenia kontaktu")
      }
    } catch (error) {
      console.error('Error creating contact:', error)
      toast.error("Wystąpił błąd podczas tworzenia kontaktu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/contacts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy kontakt</h1>
          <p className="text-gray-600">Dodaj nowy kontakt do bazy</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o kontakcie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Imię</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Jan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nazwisko</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Kowalski"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jan@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+48 123 456 789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Miasto</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Łódź"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tagi</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Dodaj tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opt-ins */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Zgody na komunikację</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optInEmail">E-mail</Label>
                    <p className="text-sm text-gray-500">Zgoda na otrzymywanie wiadomości e-mail</p>
                  </div>
                  <Switch
                    id="optInEmail"
                    checked={formData.optInEmail}
                    onCheckedChange={(checked) => handleInputChange('optInEmail', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optInSMS">SMS</Label>
                    <p className="text-sm text-gray-500">Zgoda na otrzymywanie wiadomości SMS</p>
                  </div>
                  <Switch
                    id="optInSMS"
                    checked={formData.optInSMS}
                    onCheckedChange={(checked) => handleInputChange('optInSMS', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optInPush">Push</Label>
                    <p className="text-sm text-gray-500">Zgoda na otrzymywanie powiadomień push</p>
                  </div>
                  <Switch
                    id="optInPush"
                    checked={formData.optInPush}
                    onCheckedChange={(checked) => handleInputChange('optInPush', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/contacts">
                <Button variant="outline" type="button">
                  Anuluj
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Tworzenie..." : "Utwórz kontakt"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
