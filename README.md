# Widzew CRM - AI Agent dla Kibiców + CRM

Kompleksowy system CRM z asystentem AI dla klubu piłkarskiego Widzew Łódź. System łączy w sobie chatbot AI z bazą wiedzy, zarządzanie ticketami BOK, segmentację kontaktów i integrację z Mautic.

## 🚀 Funkcje

### 🤖 AI Chat Agent z RAG
- Inteligentny asystent AI odpowiadający na pytania kibiców
- Baza wiedzy o klubie z automatycznym generowaniem embeddings
- Widget osadzany na stronie internetowej
- Metryki rozmów i ocena CSAT

### 🎫 Ticketing BOK
- System zarządzania zgłoszeniami od kibiców
- Statusy: Nowe, W toku, Oczekuje, Zamknięte
- Priorytety i przypisania do agentów
- Historia komunikacji i timeline zdarzeń

### 👥 CRM i Segmentacja
- Zarządzanie bazą kontaktów kibiców
- Segmentacja: Karnetowicze, Nowi kibice, Klienci sklepu
- Import/eksport danych CSV
- Integracja z Mautic (mock + klient konfigurowalny)

### 📢 Broadcast
- Wysyłka masowa wiadomości (e-mail, SMS, push)
- Tryb dry-run dla testowania
- Segmentacja odbiorców
- Logi wysyłek i statystyki

### 📊 Panel Administracyjny
- Dashboard z metrykami i statystykami
- Zarządzanie bazą wiedzy
- Przegląd rozmów i ticketów
- Eksport danych do CSV

## 🛠️ Stack Technologiczny

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Route handlers, Server Actions
- **Baza danych:** PostgreSQL, Prisma ORM
- **Autentykacja:** NextAuth (Email magic link + Credentials), RBAC
- **AI:** OpenAI API (domyślnie), embeddings + RAG
- **Notyfikacje:** Nodemailer, Twilio (stub), Web Push VAPID
- **Integracje:** Mautic API client (mock + real)

## 🏗️ Architektura

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel administracyjny
│   ├── api/              # API routes
│   ├── auth/             # Strony autentykacji
│   ├── widget/           # Widget czatu
│   └── page.tsx          # Strona główna
├── components/            # Komponenty React
│   ├── admin/            # Komponenty panelu admin
│   └── ui/               # Komponenty UI (shadcn/ui)
├── lib/                  # Biblioteki i utilities
│   ├── ai-provider.ts    # Provider AI (OpenAI/Mock)
│   ├── auth.ts           # Konfiguracja NextAuth
│   ├── db.ts             # Prisma client
│   ├── mautic-client.ts  # Klient Mautic
│   └── notification-provider.ts # Provider notyfikacji
└── types/                # Definicje TypeScript
```

## 🚀 Szybki start

### 1. Klonowanie i instalacja

```bash
git clone <repository-url>
cd widzew-crm
npm install
```

### 2. Konfiguracja środowiska

```bash
cp env.example .env.local
```

Edytuj `.env.local` i ustaw:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/widzew_crm?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Mailpit for development)
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_FROM="noreply@widzew.com"

# AI Provider (OpenAI)
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-3.5-turbo"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# App Configuration
NEXT_PUBLIC_CLUB_NAME="Widzew Łódź"
NEXT_PUBLIC_PRIMARY_COLOR="#AD180F"
```

### 3. Uruchomienie z Docker

```bash
# Uruchom PostgreSQL i Mailpit
docker compose up -d

# Wygeneruj klienta Prisma
npm run db:generate

# Uruchom migracje
npm run db:migrate

# Zasil bazę danych
npm run db:seed

# Uruchom aplikację
npm run dev
```

### 4. Dostęp do aplikacji

- **Strona główna:** http://localhost:3000
- **Panel admin:** http://localhost:3000/admin
- **Mailpit (e-mail):** http://localhost:8025
- **Prisma Studio:** `npm run db:studio`

## 👤 Konta testowe

| Rola | Email | Hasło |
|------|-------|-------|
| Admin | admin@widzew.com | admin123 |
| BOK | bok1@widzew.com | bok123 |
| Marketing | marketing1@widzew.com | marketing123 |
| Sprzedaż | sales1@widzew.com | sales123 |

## 📋 Dane seed

System zawiera realistyczne dane seed dla Widzew Łódź:

### 👥 Użytkownicy (8)
- 1x Admin, 3x BOK, 2x Marketing, 2x Sprzedaż

### 📚 Baza wiedzy (10 artykułów)
- Wejścia na stadion
- Parking i dojazd
- Bilety i karnety
- Regulamin stadionu
- Gastronomia i strefy kibica
- Sklep oficjalny
- Zmiany terminów meczów
- Sektor rodzinny
- Sektor gości
- Bezpieczeństwo i pomoc

### 👤 Kontakty (300)
- Atrybuty: karnet, ostatni zakup, miasto, opt-iny, tagi
- Segmenty: karnetowicz, nowy kibic, klient sklepu

### 💬 Rozmowy (25)
- Przykładowe wątki czatu z FAQ
- Odpowiedzi asystenta AI

### 🎫 Tickets (10)
- Zgłoszenia utworzone z rozmów/e-maili
- Różne statusy i priorytety

## 🔧 Konfiguracja

### AI Provider
```env
# OpenAI (produkcja)
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-3.5-turbo"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

# Mock (development)
AI_PROVIDER="mock"
```

### Notyfikacje
```env
# E-mail (Mailpit)
SMTP_HOST="localhost"
SMTP_PORT="1025"

# SMS (Twilio)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Push (Web Push)
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:admin@widzew.com"
```

### Mautic Integration
```env
MAUTIC_BASE_URL="https://your-mautic.com"
MAUTIC_USER="username"
MAUTIC_PASSWORD="password"
```

## 📱 Widget czatu

Osadź widget czatu na swojej stronie:

```html
<script src="/embed/clubchat.js" 
  data-club="Widzew Łódź" 
  data-color="#AD180F">
</script>
```

### Parametry widgetu
- `data-club` - nazwa klubu
- `data-color` - kolor główny (#AD180F)
- `data-base-url` - URL aplikacji (opcjonalnie)

## 🔐 RBAC (Role-Based Access Control)

| Rola | Dostęp |
|------|--------|
| **Admin** | Pełny dostęp do wszystkich funkcji |
| **BOK** | Rozmowy, tickets, kontakty, baza wiedzy |
| **Marketing** | Kontakty, segmenty, broadcast, raporty |
| **Sales** | Kontakty, deals, zadania |
| **Guest** | Tylko przeglądanie |

## 📊 API Endpoints

### Chat
- `POST /api/chat` - Wysłanie wiadomości do AI
- `GET /api/chat?conversationId=...` - Pobranie rozmowy

### Knowledge
- `GET /api/knowledge` - Lista artykułów
- `POST /api/knowledge` - Utworzenie artykułu
- `PUT /api/knowledge/:id` - Aktualizacja artykułu
- `DELETE /api/knowledge/:id` - Usunięcie artykułu

### Tickets
- `GET /api/tickets` - Lista ticketów
- `POST /api/tickets` - Utworzenie ticketu
- `PUT /api/tickets/:id` - Aktualizacja ticketu

### Contacts
- `GET /api/contacts` - Lista kontaktów
- `POST /api/contacts` - Utworzenie kontaktu
- `POST /api/contacts/import` - Import CSV

### Broadcast
- `POST /api/broadcast` - Wysłanie broadcastu

### Integrations
- `POST /api/integrations/mautic/sync` - Synchronizacja z Mautic
- `GET /api/integrations/mautic/test` - Test połączenia

## 🐳 Docker

```bash
# Uruchom wszystkie serwisy
docker compose up -d

# Zatrzymaj serwisy
docker compose down

# Zobacz logi
docker compose logs -f
```

### Serwisy
- **PostgreSQL** (port 5432) - baza danych
- **Mailpit** (port 1025 SMTP, 8025 Web UI) - testowanie e-maili

## 🧪 Testowanie

### Dry Run Broadcast
```bash
curl -X POST http://localhost:3000/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test",
    "content": "Test message",
    "segmentId": "segment-id",
    "channels": {"email": true},
    "isDryRun": true
  }'
```

### Test AI Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Jakie są godziny otwarcia sklepu klubowego?"
  }'
```

## 📈 Metryki i monitoring

### Dashboard metryki
- Liczba rozmów dziennie
- CSAT (Customer Satisfaction)
- Top pytania kibiców
- FRT (First Response Time)
- Liczba ticketów w kolejce

### Eksport danych
- CSV rozmów i ocen
- CSV ticketów i kontaktów
- CSV wysyłek broadcast

## 🔒 Bezpieczeństwo

- RBAC w route handlers i komponentach
- Rate limiting dla `/api/chat` i `/api/broadcast`
- Maskowanie danych w logach (email/telefon)
- Walidacja danych z Zod
- Sanityzacja inputów

## 🚀 Deployment

### Vercel (zalecane)
```bash
# Instalacja Vercel CLI
npm i -g vercel

# Deploy
vercel

# Ustaw zmienne środowiskowe w Vercel dashboard
```

### Docker Production
```bash
# Build image
docker build -t widzew-crm .

# Run container
docker run -p 3000:3000 --env-file .env.local widzew-crm
```

## 🤝 Wsparcie

- **BOK:** bok@widzew.com, +48 42 123 45 67
- **Dokumentacja:** [Link do dokumentacji]
- **Issues:** [Link do GitHub Issues]

## 📄 Licencja

© 2024 Widzew Łódź. Wszystkie prawa zastrzeżone.

---

**Widzew Łódź** - Serce Łodzi ❤️⚽