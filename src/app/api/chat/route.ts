import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getAIProvider } from "@/lib/ai-provider"
import { Channel, MessageFrom } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, contactId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: true }
      })
    } else {
      conversation = await db.conversation.create({
        data: {
          channel: Channel.WEB,
          contactId: contactId || null,
        },
        include: { messages: true }
      })
    }

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      )
    }

    // Save user message
    const userMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        from: MessageFrom.USER,
        content: message,
      }
    })

    // Get AI provider and generate response
    const aiProvider = getAIProvider()
    
    // Search for relevant knowledge chunks
    const relevantChunks = await aiProvider.searchSimilarChunks(message, 3)
    const context = relevantChunks
      .map(chunk => chunk.content)
      .join("\n\n")

    // Generate AI response
    const aiResponse = await aiProvider.generateResponse(message, context)

    // Save bot message
    const botMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        from: MessageFrom.BOT,
        content: aiResponse,
      }
    })

    // Log event
    await db.eventLog.create({
      data: {
        type: "chat_message",
        payload: JSON.stringify({
          conversationId: conversation.id,
          messageLength: message.length,
          hasContext: context.length > 0,
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        conversationId: conversation.id,
        userMessage: {
          id: userMessage.id,
          content: userMessage.content,
          from: userMessage.from,
          createdAt: userMessage.createdAt,
        },
        botMessage: {
          id: botMessage.id,
          content: botMessage.content,
          from: botMessage.from,
          createdAt: botMessage.createdAt,
        },
        context: relevantChunks.map(chunk => ({
          id: chunk.id,
          content: chunk.content,
          articleTitle: chunk.article?.title,
        }))
      }
    })

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      )
    }

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        },
        contact: true,
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: conversation
    })

  } catch (error) {
    console.error("Chat GET API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
