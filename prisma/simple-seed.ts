import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple seed...')

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@widzew.com',
      name: 'Administrator',
      role: UserRole.ADMIN,
      passwordHash: await bcrypt.hash('admin123', 10)
    }
  })

  console.log('✅ Admin user created')

  // Create one knowledge article
  const article = await prisma.knowledgeArticle.create({
    data: {
      title: "Wejścia na Stadion Miejski Widzewa Łódź",
      slug: "wejscia-na-stadion",
      markdown: `# Wejścia na Stadion Miejski Widzewa Łódź

## Lokalizacja stadionu
Stadion Miejski Widzewa Łódź znajduje się przy **al. Piłsudskiego 138, 92-300 Łódź**. Stadion jest również znany jako "Serce Łodzi" i ma pojemność 18 018 miejsc.

## Bramy wejściowe
- **Brama A** - główne wejście od strony al. Piłsudskiego
- **Brama B** - wejście od strony ul. Wólczańskiej  
- **Brama C** - wejście od strony ul. Żeromskiego
- **Brama D** - wejście od strony ul. Narutowicza

## Kontrola bezpieczeństwa
Przed wejściem na stadion każdy kibic przechodzi kontrolę bezpieczeństwa:
- Sprawdzenie tożsamości
- Kontrola bagażu
- Przeszukanie osobiste
- Sprawdzenie biletów/karnetów`,
      status: "published",
      tags: JSON.stringify(["stadion", "wejścia", "bezpieczeństwo"])
    }
  })

  // Create chunks
  const chunks = article.markdown
    .split(/\n\s*\n/)
    .filter(chunk => chunk.trim().length > 50)
    .map(chunk => chunk.trim())

  for (const chunkContent of chunks) {
    const embedding = Array(100).fill(0).map(() => Math.random() - 0.5)
    
    await prisma.articleChunk.create({
      data: {
        articleId: article.id,
        content: chunkContent,
        embedding: JSON.stringify(embedding)
      }
    })
  }

  console.log('✅ Knowledge article created')

  // Create sample contact
  await prisma.contact.create({
    data: {
      email: 'jan.kowalski@example.com',
      phone: '+48 123456789',
      firstName: 'Jan',
      lastName: 'Kowalski',
      city: 'Łódź',
      tags: JSON.stringify(['karnetowicz']),
      customFields: JSON.stringify({
        seasonPass: true,
        lastMatchDate: new Date()
      }),
      optInEmail: true,
      optInSMS: false,
      optInPush: true
    }
  })

  console.log('✅ Sample contact created')

  // Create sample conversation
  const conversation = await prisma.conversation.create({
    data: {
      channel: 'WEB',
      contactId: (await prisma.contact.findFirst())?.id
    }
  })

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      from: 'USER',
      content: 'Jakie są godziny otwarcia sklepu klubowego?'
    }
  })

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      from: 'BOT',
      content: 'Sklep klubowy jest otwarty od poniedziałku do piątku w godzinach 10:00-18:00, a w soboty 10:00-16:00.'
    }
  })

  console.log('✅ Sample conversation created')

  console.log('🎉 Simple seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
