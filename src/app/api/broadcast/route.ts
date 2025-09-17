import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getNotificationProvider } from "@/lib/notification-provider"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to send broadcasts
    if (!["ADMIN", "MARKETING"].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const { subject, content, segmentId, channels, isDryRun } = await request.json()

    if (!subject || !content || !segmentId) {
      return NextResponse.json(
        { success: false, error: "Subject, content, and segmentId are required" },
        { status: 400 }
      )
    }

    // Get segment
    const segment = await db.segment.findUnique({
      where: { id: segmentId }
    })

    if (!segment) {
      return NextResponse.json(
        { success: false, error: "Segment not found" },
        { status: 404 }
      )
    }

    // Get contacts for segment (simplified - in real app you'd evaluate rules)
    const contacts = await db.contact.findMany({
      where: {
        // Example: get contacts with specific tags or conditions
        OR: [
          { tags: { has: "karnetowicz" } },
          { customFields: { path: ["seasonPass"], equals: true } }
        ]
      }
    })

    const selectedChannels = Object.entries(channels).filter(([_, selected]) => selected)
    
    if (selectedChannels.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one channel must be selected" },
        { status: 400 }
      )
    }

    const results = {
      totalContacts: contacts.length,
      channels: selectedChannels.map(([channel, _]) => channel),
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    if (isDryRun) {
      // Dry run - just log the action
      await db.eventLog.create({
        data: {
          type: "broadcast_dry_run",
        payload: JSON.stringify({
          subject,
          content,
          segmentId,
          channels: selectedChannels,
          contactCount: contacts.length,
          userId: session.user.id
        })
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          ...results,
          dryRun: true,
          message: `Dry run completed. Would send to ${contacts.length} contacts via ${selectedChannels.join(', ')}`
        }
      })
    }

    // Real broadcast
    for (const contact of contacts) {
      for (const [channel, _] of selectedChannels) {
        try {
          const provider = getNotificationProvider(channel as "email" | "sms" | "push")
          let success = false

          switch (channel) {
            case "email":
              if (contact.email && contact.optInEmail) {
                success = await provider.sendEmail(contact.email, subject, content)
              }
              break
            case "sms":
              if (contact.phone && contact.optInSMS) {
                success = await provider.sendSMS(contact.phone, content)
              }
              break
            case "push":
              if (contact.optInPush) {
                // In real app, you'd get push token from contact
                const mockToken = JSON.stringify({ endpoint: "mock-endpoint", keys: {} })
                success = await provider.sendPush(mockToken, subject, content)
              }
              break
          }

          if (success) {
            results.sent++
          } else {
            results.failed++
            results.errors.push(`Failed to send ${channel} to ${contact.email || contact.phone}`)
          }

          // Log notification
          await db.notification.create({
            data: {
              type: channel.toUpperCase() as "EMAIL" | "SMS" | "PUSH",
              to: contact.email || contact.phone || "unknown",
              payload: JSON.stringify({
                subject,
                content,
                contactId: contact.id
              }),
              status: success ? "SENT" : "FAILED"
            }
          })

        } catch (error) {
          results.failed++
          results.errors.push(`Error sending ${channel} to ${contact.email || contact.phone}: ${error}`)
        }
      }
    }

    // Log broadcast event
    await db.eventLog.create({
      data: {
        type: "broadcast_sent",
        payload: JSON.stringify({
          subject,
          content,
          segmentId,
          channels: selectedChannels,
          results,
          userId: session.user.id
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        dryRun: false,
        message: `Broadcast sent to ${results.sent} contacts successfully, ${results.failed} failed`
      }
    })

  } catch (error) {
    console.error("Broadcast API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
