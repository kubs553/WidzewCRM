import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } }
      ]
    }

    const contacts = await db.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        conversations: true,
        tickets: true,
        deals: true
      }
    })

    // Filter by tag if specified
    let filteredContacts = contacts
    if (tag) {
      filteredContacts = contacts.filter(contact => {
        const tags = typeof contact.tags === 'string' ? JSON.parse(contact.tags) : contact.tags
        return tags.includes(tag)
      })
    }

    return NextResponse.json({ contacts: filteredContacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
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
    const { email, phone, firstName, lastName, city, tags, optInEmail, optInSMS, optInPush } = body

    // Check if contact with this email already exists
    if (email) {
      const existingContact = await db.contact.findUnique({
        where: { email }
      })

      if (existingContact) {
        return NextResponse.json({ error: "Contact with this email already exists" }, { status: 400 })
      }
    }

    // Create contact
    const contact = await db.contact.create({
      data: {
        email,
        phone,
        firstName,
        lastName,
        city,
        tags: JSON.stringify(tags || []),
        optInEmail: optInEmail || false,
        optInSMS: optInSMS || false,
        optInPush: optInPush || false
      },
      include: {
        conversations: true,
        tickets: true,
        deals: true
      }
    })

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
