"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

export default function NewKnowledgeArticle() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    markdown: "",
    status: "draft",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/knowledge')
      } else {
        console.error('Failed to create article')
      }
    } catch (error) {
      console.error('Error creating article:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/knowledge">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Powrót
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy artykuł</h1>
          <p className="text-gray-600">Utwórz nowy artykuł w bazie wiedzy</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Podstawowe informacje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tytuł</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="np. Wejścia na Stadion Miejski Widzewa Łódź"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="wejscia-na-stadion"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Szkic</SelectItem>
                      <SelectItem value="published">Opublikowany</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tagi</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Dodaj tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Dodaj
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treść artykułu</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.markdown}
                  onChange={(e) => setFormData(prev => ({ ...prev, markdown: e.target.value }))}
                  placeholder="Napisz treść artykułu w formacie Markdown..."
                  className="min-h-[400px] font-mono text-sm"
                  required
                />
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
                <div className="prose prose-sm max-w-none">
                  <h3>{formData.title || "Tytuł artykułu"}</h3>
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.markdown 
                        ? formData.markdown.replace(/\n/g, '<br>') 
                        : &quot;Treść artykułu pojawi się tutaj...&quot; 
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informacje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Artykuł zostanie automatycznie podzielony na fragmenty</p>
                <p>• Fragmenty będą użyte do trenowania asystenta AI</p>
                <p>• Status "Opublikowany" oznacza dostępność dla AI</p>
                <p>• Tagi pomagają w kategoryzacji treści</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/knowledge">
            <Button variant="outline">Anuluj</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Zapisywanie..." : "Zapisz artykuł"}
          </Button>
        </div>
      </form>
    </div>
  )
}
