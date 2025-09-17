import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

async function getKnowledgeArticles() {
  return await db.knowledgeArticle.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      chunks: true
    }
  })
}

export default async function KnowledgePage() {
  const articles = await getKnowledgeArticles()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published": return "Opublikowany"
      case "draft": return "Szkic"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Baza wiedzy</h1>
          <p className="text-gray-600">Zarządzaj artykułami dla asystenta AI</p>
        </div>
        <Link href="/admin/knowledge/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nowy artykuł
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Slug: {article.slug}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(article.status)}>
                      {getStatusLabel(article.status)}
                    </Badge>
                    <Badge variant="outline">
                      {article.chunks.length} fragmentów
                    </Badge>
                    {(() => {
                      const tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;
                      return tags.length > 0 && (
                        <div className="flex space-x-1">
                          {tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/knowledge/${article.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div 
                  className="text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: article.markdown.replace(/\n/g, '<br>').substring(0, 200) + '...' 
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>Utworzony: {new Date(article.createdAt).toLocaleDateString('pl-PL')}</span>
                <span>Zaktualizowany: {new Date(article.updatedAt).toLocaleDateString('pl-PL')}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {articles.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Brak artykułów</h3>
              <p className="text-gray-600 text-center mb-6">
                Zacznij od utworzenia pierwszego artykułu w bazie wiedzy dla asystenta AI.
              </p>
              <Link href="/admin/knowledge/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Utwórz pierwszy artykuł
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
