import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getAIProvider } from "@/lib/ai-provider"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { markdown: { contains: search, mode: "insensitive" } },
        { tags: { has: search } }
      ]
    }

    const articles = await db.knowledgeArticle.findMany({
      where,
      include: {
        chunks: true
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({ success: true, data: articles })

  } catch (error) {
    console.error("Knowledge GET API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { title, slug, markdown, status, tags } = await request.json()

    if (!title || !slug || !markdown) {
      return NextResponse.json(
        { success: false, error: "Title, slug, and markdown are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingArticle = await db.knowledgeArticle.findUnique({
      where: { slug }
    })

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 400 }
      )
    }

    // Create article
    const article = await db.knowledgeArticle.create({
      data: {
        title,
        slug,
        markdown,
        status: status || "draft",
        tags: tags || []
      }
    })

    // Generate embeddings and chunks
    await generateArticleChunks(article.id, markdown)

    return NextResponse.json({ success: true, data: article })

  } catch (error) {
    console.error("Knowledge POST API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generateArticleChunks(articleId: string, markdown: string) {
  try {
    const aiProvider = getAIProvider()
    
    // Simple chunking by paragraphs and sections
    const chunks = markdown
      .split(/\n\s*\n/)
      .filter(chunk => chunk.trim().length > 50)
      .map(chunk => chunk.trim())

    // Create chunks with embeddings
    for (const chunkContent of chunks) {
      const embedding = await aiProvider.generateEmbedding(chunkContent)
      
      await db.articleChunk.create({
        data: {
          articleId,
          content: chunkContent,
          embedding: embedding
        }
      })
    }

    console.log(`Generated ${chunks.length} chunks for article ${articleId}`)
  } catch (error) {
    console.error("Error generating article chunks:", error)
  }
}
