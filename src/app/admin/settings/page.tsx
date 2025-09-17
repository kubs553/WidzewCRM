import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, MessageSquare, Bell, Zap, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-600">Konfiguracja systemu i providerów</p>
      </div>

      <div className="grid gap-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clubName">Nazwa klubu</Label>
                <Input id="clubName" defaultValue="Widzew Łódź" />
              </div>
              <div>
                <Label htmlFor="primaryColor">Kolor główny</Label>
                <Input id="primaryColor" defaultValue="#AD180F" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secondaryColor">Kolor drugorzędny</Label>
                <Input id="secondaryColor" defaultValue="#FFFFFF" />
              </div>
              <div>
                <Label htmlFor="accentColor">Kolor akcentu</Label>
                <Input id="accentColor" defaultValue="#C9A227" />
              </div>
            </div>
            <Button>Zapisz zmiany</Button>
          </CardContent>
        </Card>

        {/* Email Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Provider E-mail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mailpit (Development)</div>
                <div className="text-sm text-gray-600">Lokalny serwer SMTP dla testów</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Aktywny</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">Host SMTP</Label>
                <Input id="smtpHost" defaultValue="localhost" />
              </div>
              <div>
                <Label htmlFor="smtpPort">Port SMTP</Label>
                <Input id="smtpPort" defaultValue="1025" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="emailEnabled" defaultChecked />
              <Label htmlFor="emailEnabled">Włącz wysyłkę e-maili</Label>
            </div>
          </CardContent>
        </Card>

        {/* SMS Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Provider SMS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Twilio</div>
                <div className="text-sm text-gray-600">SMS API provider</div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Mock</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twilioSid">Account SID</Label>
                <Input id="twilioSid" placeholder="Twój Account SID" />
              </div>
              <div>
                <Label htmlFor="twilioToken">Auth Token</Label>
                <Input id="twilioToken" type="password" placeholder="Twój Auth Token" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="smsEnabled" />
              <Label htmlFor="smsEnabled">Włącz wysyłkę SMS</Label>
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Web Push VAPID</div>
                <div className="text-sm text-gray-600">Push notifications dla przeglądarek</div>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Nieaktywny</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vapidPublic">VAPID Public Key</Label>
                <Input id="vapidPublic" placeholder="Wygeneruj klucze VAPID" />
              </div>
              <div>
                <Label htmlFor="vapidPrivate">VAPID Private Key</Label>
                <Input id="vapidPrivate" type="password" placeholder="Wygeneruj klucze VAPID" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="pushEnabled" />
              <Label htmlFor="pushEnabled">Włącz push notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              AI Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">OpenAI</div>
                <div className="text-sm text-gray-600">GPT-3.5-turbo + text-embedding-3-small</div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Mock</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openaiKey">OpenAI API Key</Label>
                <Input id="openaiKey" type="password" placeholder="sk-..." />
              </div>
              <div>
                <Label htmlFor="openaiModel">Model</Label>
                <Input id="openaiModel" defaultValue="gpt-3.5-turbo" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="aiEnabled" defaultChecked />
              <Label htmlFor="aiEnabled">Włącz AI chat</Label>
            </div>
          </CardContent>
        </Card>

        {/* Mautic Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Integracja Mautic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mautic CRM</div>
                <div className="text-sm text-gray-600">Dwukierunkowa synchronizacja kontaktów</div>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Nieaktywny</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="mauticUrl">Mautic Base URL</Label>
                <Input id="mauticUrl" placeholder="https://your-mautic.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mauticUser">Username</Label>
                <Input id="mauticUser" placeholder="Mautic username" />
              </div>
              <div>
                <Label htmlFor="mauticPassword">Password</Label>
                <Input id="mauticPassword" type="password" placeholder="Mautic password" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="mauticEnabled" />
              <Label htmlFor="mauticEnabled">Włącz synchronizację z Mautic</Label>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Test połączenia</Button>
              <Button variant="outline">Synchronizuj teraz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
