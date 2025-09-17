import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TicketStatus, TicketPriority } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigneeId = searchParams.get('assigneeId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (assigneeId) where.assigneeId = assigneeId

    const tickets = await db.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignee: true,
        contact: true,
        conversation: true
      }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subject, description, priority, status, contactEmail, contactPhone, contactName } = body

    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description are required" }, { status: 400 })
    }

    // Find or create contact
    let contact = null
    if (contactEmail) {
      contact = await db.contact.findUnique({
        where: { email: contactEmail }
      })

      if (!contact && (contactName || contactPhone)) {
        contact = await db.contact.create({
          data: {
            email: contactEmail,
            firstName: contactName?.split(' ')[0],
            lastName: contactName?.split(' ').slice(1).join(' '),
            phone: contactPhone,
            optInEmail: true,
            optInSMS: !!contactPhone,
            optInPush: false
          }
        })
      }
    }

    // Create ticket
    const ticket = await db.ticket.create({
      data: {
        subject,
        description,
        status: (status as TicketStatus) || TicketStatus.NEW,
        priority: (priority as TicketPriority) || TicketPriority.MEDIUM,
        contactId: contact?.id,
        assigneeId: session.user.role === 'ADMIN' ? session.user.id : null
      },
      include: {
        assignee: true,
        contact: true,
        conversation: true
      }
    })

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
