"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Nieprawidłowy email lub hasło")
      } else {
        router.push("/admin")
      }
    } catch (error) {
      setError("Wystąpił błąd podczas logowania")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError("Wystąpił błąd podczas wysyłania linku")
      } else {
        setIsEmailSent(true)
      }
    } catch (error) {
      setError("Wystąpił błąd podczas wysyłania linku")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót do strony głównej
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_%C5%81%C3%B3d%C5%BA.png" 
                alt="Widzew Łódź" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Widzew CRM</h1>
              <p className="text-sm text-gray-600">Panel administracyjny</p>
            </div>
          </div>
        </div>

        {isEmailSent ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sprawdź swoją skrzynkę</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">
                  Wysłaliśmy link logowania na adres <strong>{email}</strong>
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Sprawdź swoją skrzynkę odbiorczą i kliknij link, aby się zalogować.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsEmailSent(false)}
                className="w-full"
              >
                Wróć do logowania
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Zaloguj się</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@widzew.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Hasło</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Lock className="mr-2 h-4 w-4" />
                    {isLoading ? "Logowanie..." : "Zaloguj się"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Lub</span>
                  </div>
                </div>

                <form onSubmit={handleEmailSignIn}>
                  <Button type="submit" variant="outline" className="w-full" disabled={isLoading || !email}>
                    <Mail className="mr-2 h-4 w-4" />
                    {isLoading ? "Wysyłanie..." : "Wyślij link logowania"}
                  </Button>
                </form>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Konta testowe:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Admin:</strong> admin@widzew.com / admin123</div>
                  <div><strong>BOK:</strong> bok1@widzew.com / bok123</div>
                  <div><strong>Marketing:</strong> marketing1@widzew.com / marketing123</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
