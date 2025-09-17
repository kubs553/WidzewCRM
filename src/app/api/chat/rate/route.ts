import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { messageId, rating } = await request.json()

    if (!messageId || !rating) {
      return NextResponse.json(
        { success: false, error: "MessageId and rating are required" },
        { status: 400 }
      )
    }

    // Update message rating
    const message = await db.message.update({
      where: { id: messageId },
      data: { rating }
    })

    // Log rating event
    await db.eventLog.create({
      data: {
        type: "message_rated",
        payload: {
          messageId,
          rating,
          conversationId: message.conversationId
        }
      }
    })

    return NextResponse.json({ success: true, data: message })

  } catch (error) {
    console.error("Rate message API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
