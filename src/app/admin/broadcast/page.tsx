"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Users, Eye, TestTube } from "lucide-react"

export default function BroadcastPage() {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    segmentId: "",
    channels: {
      email: false,
      sms: false,
      push: false
    },
    isDryRun: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewCount, setPreviewCount] = useState(0)

  const segments = [
    { id: "1", name: "Karnetowicze", count: 45 },
    { id: "2", name: "Nowi kibice", count: 23 },
    { id: "3", name: "Klienci sklepu", count: 67 },
    { id: "4", name: "Wszyscy", count: 156 }
  ]

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: checked
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Broadcast result:', result)
        // Handle success
      } else {
        console.error('Failed to send broadcast')
      }
    } catch (error) {
      console.error('Error sending broadcast:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedSegment = segments.find(s => s.id === formData.segmentId)
  const selectedChannels = Object.entries(formData.channels).filter(([_, selected]) => selected)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Broadcast</h1>
        <p className="text-gray-600">Wyślij wiadomości do segmentów kontaktów</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Treść wiadomości</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Temat</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="np. Zmiana godziny meczu"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Treść</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Napisz treść wiadomości..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment docelowy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="segment">Wybierz segment</Label>
                  <Select value={formData.segmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, segmentId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count} kontaktów)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSegment && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700">{selectedSegment.name}</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      {selectedSegment.count} kontaktów w segmencie
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kanały komunikacji</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={formData.channels.email}
                      onCheckedChange={(checked) => handleChannelChange('email', checked as boolean)}
                    />
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>E-mail</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={formData.channels.sms}
                      onCheckedChange={(checked) => handleChannelChange('sms', checked as boolean)}
                    />
                    <Label htmlFor="sms" className="flex items-center space-x-2">
                      <span>📱</span>
                      <span>SMS</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="push"
                      checked={formData.channels.push}
                      onCheckedChange={(checked) => handleChannelChange('push', checked as boolean)}
                    />
                    <Label htmlFor="push" className="flex items-center space-x-2">
                      <span>🔔</span>
                      <span>Push notification</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  Podgląd
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Temat:</div>
                    <div className="text-sm text-gray-600">
                      {formData.subject || "Temat wiadomości"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Treść:</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {formData.content || "Treść wiadomości pojawi się tutaj..."}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Kanały:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedChannels.map(([channel, _]) => (
                        <Badge key={channel} variant="outline">
                          {channel === 'email' ? 'E-mail' : 
                           channel === 'sms' ? 'SMS' : 
                           channel === 'push' ? 'Push' : channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-4 w-4" />
                  Tryb testowy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dryRun"
                      checked={formData.isDryRun}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDryRun: checked as boolean }))}
                    />
                    <Label htmlFor="dryRun">Dry run (nie wysyłaj rzeczywiście)</Label>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    W trybie dry run wiadomości będą tylko logowane, bez rzeczywistego wysyłania.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statystyki</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segment:</span>
                    <span className="font-medium">{selectedSegment?.name || "Nie wybrano"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kontakty:</span>
                    <span className="font-medium">{selectedSegment?.count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kanały:</span>
                    <span className="font-medium">{selectedChannels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tryb:</span>
                    <span className="font-medium">{formData.isDryRun ? "Test" : "Produkcja"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Podgląd
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.subject || !formData.content || !formData.segmentId || selectedChannels.length === 0}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Wysyłanie..." : formData.isDryRun ? "Testuj wysyłkę" : "Wyślij broadcast"}
          </Button>
        </div>
      </form>
    </div>
  )
}
