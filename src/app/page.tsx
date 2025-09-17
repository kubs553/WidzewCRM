import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, BookOpen, BarChart3, Shield, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_%C5%81%C3%B3d%C5%BA.png" 
                  alt="Widzew Łódź" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Widzew CRM</h1>
                <p className="text-sm text-gray-600">AI Agent dla Kibiców + CRM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Zaloguj się</Button>
              </Link>
              <Link href="/admin">
                <Button>Panel administracyjny</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Agent dla Kibiców
            <span className="block text-red-600">Widzew Łódź</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kompleksowy system CRM z asystentem AI, zarządzaniem ticketami BOK, 
            segmentacją kontaktów i integracją z Mautic. Wszystko w jednym miejscu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Rozpocznij demo
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Zobacz funkcje
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funkcje systemu
            </h2>
            <p className="text-lg text-gray-600">
              Wszystko czego potrzebujesz do zarządzania relacjami z kibicami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Chat AI z RAG</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Inteligentny asystent AI z bazą wiedzy o klubie. Odpowiada na pytania 
                  kibiców o stadion, bilety, parkingi i regulaminy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Ticketing BOK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  System zarządzania zgłoszeniami z statusami, priorytetami, 
                  przypisaniami i historią komunikacji.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>CRM i Segmentacja</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Zarządzanie kontaktami kibiców z segmentacją, tagowaniem 
                  i integracją z systemem Mautic.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Baza wiedzy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Zarządzanie artykułami wiedzy z automatycznym generowaniem 
                  embeddings dla asystenta AI.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Broadcast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Wysyłka masowa wiadomości przez e-mail, SMS i push notifications 
                  do wybranych segmentów.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Raporty i analityka</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Dashboard z metrykami rozmów, CSAT, top pytaniami i eksportem 
                  danych do CSV.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Widget Demo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Widget czatu AI
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Osadzaj inteligentny czat na swojej stronie internetowej
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6 text-left max-w-2xl mx-auto">
              <div className="text-green-400 text-sm mb-2">{'// Kod do osadzenia na stronie'}</div>
              <code className="text-white text-sm">
                {`<script src="/embed/clubchat.js" 
  data-club="Widzew Łódź" 
  data-color="#AD180F">
</script>`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_%C5%81%C3%B3d%C5%BA.png" 
                    alt="Widzew Łódź" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Widzew CRM</span>
              </div>
              <p className="text-gray-400">
                Kompleksowy system CRM z asystentem AI dla klubu Widzew Łódź.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Funkcje</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Chat AI z RAG</li>
                <li>Ticketing BOK</li>
                <li>CRM i segmentacja</li>
                <li>Broadcast</li>
                <li>Raporty</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Kontakt</h3>
              <ul className="space-y-2 text-gray-400">
                <li>bok@widzew.com</li>
                <li>+48 42 123 45 67</li>
                <li>al. Piłsudskiego 138</li>
                <li>92-300 Łódź</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Widzew Łódź. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <script src="/embed/clubchat.js" 
        data-club="Widzew Łódź" 
        data-color="#AD180F">
      </script>
    </div>
  )
}