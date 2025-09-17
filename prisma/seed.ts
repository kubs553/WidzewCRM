import { PrismaClient, UserRole, Channel, MessageFrom, TicketStatus, TicketPriority } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@widzew.com',
      name: 'Administrator',
      role: UserRole.ADMIN,
      passwordHash: await bcrypt.hash('admin123', 10)
    }
  })

  const bokUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'bok1@widzew.com',
        name: 'Anna Kowalska',
        role: UserRole.BOK,
        passwordHash: await bcrypt.hash('bok123', 10)
      }
    }),
    prisma.user.create({
      data: {
        email: 'bok2@widzew.com',
        name: 'Piotr Nowak',
        role: UserRole.BOK,
        passwordHash: await bcrypt.hash('bok123', 10)
      }
    }),
    prisma.user.create({
      data: {
        email: 'bok3@widzew.com',
        name: 'Maria Wiśniewska',
        role: UserRole.BOK,
        passwordHash: await bcrypt.hash('bok123', 10)
      }
    })
  ])

  const marketingUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'marketing1@widzew.com',
        name: 'Tomasz Zieliński',
        role: UserRole.MARKETING,
        passwordHash: await bcrypt.hash('marketing123', 10)
      }
    }),
    prisma.user.create({
      data: {
        email: 'marketing2@widzew.com',
        name: 'Katarzyna Lewandowska',
        role: UserRole.MARKETING,
        passwordHash: await bcrypt.hash('marketing123', 10)
      }
    })
  ])

  const salesUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sales1@widzew.com',
        name: 'Michał Dąbrowski',
        role: UserRole.SALES,
        passwordHash: await bcrypt.hash('sales123', 10)
      }
    }),
    prisma.user.create({
      data: {
        email: 'sales2@widzew.com',
        name: 'Agnieszka Kamińska',
        role: UserRole.SALES,
        passwordHash: await bcrypt.hash('sales123', 10)
      }
    })
  ])

  console.log('✅ Users created')

  // Create knowledge articles
  const articles = [
    {
      title: "Wejścia na Stadion Miejski Widzewa Łódź (Serce Łodzi)",
      slug: "wejscia-na-stadion",
      markdown: `# Wejścia na Stadion Miejski Widzewa Łódź (Serce Łodzi)

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
- Sprawdzenie biletów/karnetów

## Wskazówki dla rodzin
- Sektor rodzinny znajduje się w trybunie "Pod Zegarem"
- Specjalne wejście dla rodzin z małymi dziećmi przy Bramie A
- Wózek dziecięcy można zostawić w specjalnym miejscu przy wejściu
- Dostępne są pokoje dla matek karmiących

## Wskazówki dla gości
- Kibice gości wchodzą przez Bramę C
- Sektor gości ma 907 miejsc
- Obowiązuje specjalny regulamin dla kibiców gości
- Zabronione jest wnoszenie materiałów promocyjnych innych klubów`,
      status: "published",
      tags: JSON.stringify(["stadion", "wejścia", "bezpieczeństwo", "rodziny", "goście"])
    },
    {
      title: "Parking i dojazd",
      slug: "parking-dojazd",
      markdown: `# Parking i dojazd na stadion Widzew Łódź

## Dojazd komunikacją miejską
**Autobusy:**
- Linia 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
- Przystanek "Stadion Widzew" - bezpośrednio przy stadionie

**Tramwaje:**
- Linia 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
- Przystanek "Stadion Widzew" - 5 minut spacerem

## Parkingi w okolicy
**Parking przy stadionie:**
- Pojemność: 200 miejsc
- Opłata: 10 zł za mecz
- Otwarty 2 godziny przed meczem

**Parkingi publiczne:**
- Parking przy Centrum Handlowym "Manufaktura" - 15 minut spacerem
- Parking przy Dworcu Łódź Fabryczna - 20 minut spacerem
- Parking przy ul. Wólczańskiej - 10 minut spacerem

## Rekomendacje przy pełnym obłożeniu
- Przyjeżdżaj minimum 1,5 godziny przed meczem
- Rozważ dojazd komunikacją miejską
- Jeśli jedziesz samochodem, miej plan B na parking
- Sprawdź aktualne informacje o utrudnieniach drogowych`,
      status: "published",
      tags: JSON.stringify(["parking", "dojazd", "komunikacja", "autobus", "tramwaj"])
    },
    {
      title: "Bilety i karnety",
      slug: "bilety-karnety",
      markdown: `# Bilety i karnety Widzew Łódź

## Kanały sprzedaży
**Online:**
- Oficjalna strona internetowa Widzew Łódź
- Aplikacja mobilna klubu
- System biletowy online dostępny 24/7

**Kasy stadionu:**
- Kasa główna przy Bramie A
- Kasa przy Bramie B
- Godziny otwarcia: 10:00-18:00 (pon-pt), 10:00-16:00 (sob)

**Punkty sprzedaży:**
- Centrum Handlowe "Manufaktura"
- Dworzec Łódź Fabryczna
- Sklep klubowy przy stadionie

## Weryfikacja biletów
- Bilety elektroniczne - kod QR na telefonie
- Bilety papierowe - kod kreskowy
- Karnety sezonowe - karta magnetyczna
- Weryfikacja przy wejściu na stadion

## Zasady ulg
**Ulgowe (50% zniżki):**
- Dzieci do 16 roku życia
- Studenci do 26 roku życia (z ważną legitymacją)
- Emeryci i renciści (z ważną legitymacją)
- Osoby niepełnosprawne (z ważną legitymacją)

**Bezpłatne:**
- Dzieci do 3 roku życia (na kolanach rodzica)
- Opiekunowie osób niepełnosprawnych

## Karnety sezonowe
- Dostępne dla wszystkich sektorów
- Zniżka 20% w porównaniu do biletów jednorazowych
- Możliwość rezerwacji miejsca
- Dodatkowe benefity dla karnetowiczów`,
      status: "published",
      tags: JSON.stringify(["bilety", "karnety", "sprzedaż", "ulgowe", "weryfikacja"])
    },
    {
      title: "Regulamin stadionu",
      slug: "regulamin-stadionu",
      markdown: `# Regulamin stadionu Widzew Łódź

## Zasady wnoszenia przedmiotów
**Dozwolone:**
- Telefony komórkowe
- Aparaty fotograficzne (bez statywu)
- Małe torby i plecaki (max 30x20x10 cm)
- Butelki plastikowe (bez nakrętek)
- Jedzenie i napoje (bez alkoholu)

**Zabronione:**
- Alkohol i napoje alkoholowe
- Szkło i metalowe pojemniki
- Broń i przedmioty niebezpieczne
- Materiały promocyjne innych klubów
- Statywy i monopod
- Drony i inne urządzenia latające
- Zwierzęta (oprócz psów przewodników)

## Informacje dla osób z niepełnosprawnościami
- Specjalne miejsca parkingowe przy stadionie
- Własne wejście przy Bramie A
- Podjazdy i windy dostępne
- Toalety dostosowane dla osób niepełnosprawnych
- Możliwość skorzystania z wózka inwalidzkiego (po wcześniejszym zgłoszeniu)

## Zachowanie na stadionie
- Szanuj innych kibiców
- Nie używaj wulgarnego języka
- Nie rzucaj przedmiotami na boisko
- Przestrzegaj poleceń służb porządkowych
- Nie wchodź na boisko podczas meczu

## Bezpieczeństwo
- Wszystkie osoby są poddawane kontroli bezpieczeństwa
- Służby porządkowe mają prawo do kontroli bagażu
- W przypadku naruszenia regulaminu możliwe jest usunięcie ze stadionu
- Zabronione jest palenie tytoniu na całym terenie stadionu`,
      status: "published",
      tags: JSON.stringify(["regulamin", "bezpieczeństwo", "przedmioty", "niepełnosprawni", "zachowanie"])
    },
    {
      title: "Gastronomia i strefy kibica",
      slug: "gastronomia-strefy",
      markdown: `# Gastronomia i strefy kibica na stadionie Widzew

## Punkty gastronomiczne
**Strefa główna:**
- Bar "Widzew" - dania gorące, przekąski
- Kawiarnia "Serce Łodzi" - kawa, ciasta, kanapki
- Grill "Pod Zegarem" - kiełbaski, hamburgery

**Trybuny:**
- Punkty gastronomiczne na każdej trybunie
- Automaty z napojami i przekąskami
- Mobilne punkty sprzedaży podczas meczów

## Metody płatności
- Gotówka (PLN)
- Karty płatnicze (Visa, Mastercard)
- Płatności mobilne (BLIK, Apple Pay, Google Pay)
- Karty klubowe (dla karnetowiczów)

## Menu
**Dania gorące:**
- Kiełbasa z grilla - 15 zł
- Hamburger - 18 zł
- Hot dog - 12 zł
- Zapiekanka - 14 zł

**Napoje:**
- Piwo (0,5l) - 8 zł
- Cola/Pepsi (0,5l) - 6 zł
- Woda (0,5l) - 4 zł
- Kawa - 8 zł

**Przekąski:**
- Chipsy - 5 zł
- Orzeszki - 6 zł
- Cukierki - 3 zł

## Kolejki i czasy oczekiwania
- Przed meczem: 5-10 minut
- W przerwie: 15-20 minut
- Po meczu: 10-15 minut

**Wskazówki:**
- Zamawiaj wcześniej przed meczem
- Używaj aplikacji mobilnej do zamówień
- Rozważ zakupy w przerwie meczu`,
      status: "published",
      tags: JSON.stringify(["gastronomia", "jedzenie", "napoje", "płatności", "menu"]
    },
    {
      title: "Sklep oficjalny",
      slug: "sklep-oficjalny",
      markdown: `# Sklep oficjalny Widzew Łódź

## Lokalizacja
Sklep oficjalny znajduje się przy stadionie Widzew Łódź:
**Adres:** al. Piłsudskiego 138, 92-300 Łódź
**Wejście:** przy Bramie A (główne wejście)

## Godziny otwarcia
**Poniedziałek - Piątek:** 10:00 - 18:00
**Sobota:** 10:00 - 16:00
**Niedziela:** Zamknięte (oprócz dni meczowych)

**Dni meczowe:**
- 2 godziny przed meczem
- Do 1 godziny po meczu

## Asortyment
**Odzież:**
- Koszulki meczowe (domowe, wyjazdowe, specjalne)
- Bluzy i kurtki klubowe
- Spodenki i getry
- Czapki i szaliki

**Akcesoria:**
- Szaliki klubowe
- Flagi i transparenty
- Bidony i termosy
- Torby i plecaki

**Pamiątki:**
- Magnesy i naklejki
- Kubki i talerze
- Maskotki klubowe
- Zdjęcia i plakaty

## Zwroty i wymiany
- 14 dni na zwrot (z paragonem)
- Wymiana na inny rozmiar
- Zwrot gotówką lub na kartę
- Uszkodzone produkty - natychmiastowa wymiana

## Płatności
- Gotówka (PLN)
- Karty płatnicze
- Płatności mobilne
- Karty klubowe (zniżka 10% dla karnetowiczów)`,
      status: "published",
      tags: JSON.stringify(["sklep", "odzież", "akcesoria", "pamiątki", "zwroty"]
    },
    {
      title: "Zmiany terminów meczów",
      slug: "zmiany-terminow",
      markdown: `# Zmiany terminów meczów Widzew Łódź

## Jak włączyć powiadomienia
**E-mail:**
1. Zaloguj się na stronie internetowej klubu
2. Przejdź do sekcji "Moje konto"
3. Włącz powiadomienia e-mailowe
4. Potwierdź adres e-mail

**SMS:**
1. Dodaj numer telefonu do swojego konta
2. Włącz powiadomienia SMS
3. Potwierdź numer kodem weryfikacyjnym

**Push notifications:**
1. Pobierz aplikację mobilną Widzew Łódź
2. Włącz powiadomienia w ustawieniach aplikacji
3. Wybierz typy powiadomień

## Rodzaje powiadomień
**Zmiany terminów:**
- Przesunięcie meczu
- Zmiana godziny rozpoczęcia
- Odwołanie meczu

**Informacje dodatkowe:**
- Zmiana trybuny
- Zmiana bramy wejściowej
- Ważne komunikaty klubowe

## Kiedy otrzymujesz powiadomienia
- Natychmiast po potwierdzeniu zmiany
- Minimum 24 godziny przed meczem
- W przypadku odwołania - natychmiast

## Co robić w przypadku zmiany
1. Sprawdź nowy termin w aplikacji/stronie
2. Zaktualizuj swój kalendarz
3. Poinformuj znajomych o zmianie
4. W przypadku problemów skontaktuj się z BOK

## Kontakt w sprawie zmian
**Biuro Obsługi Klienta:**
- Telefon: +48 42 123 45 67
- E-mail: bok@widzew.com
- Godziny: 9:00-17:00 (pon-pt)`,
      status: "published",
      tags: JSON.stringify(["powiadomienia", "zmiany", "terminy", "sms", "email", "push"]
    },
    {
      title: "Sektor rodzinny",
      slug: "sektor-rodzinny",
      markdown: `# Sektor rodzinny na stadionie Widzew

## Lokalizacja
Sektor rodzinny znajduje się w trybunie **"Pod Zegarem"** na wysokości bramek.

## Udogodnienia
**Dla dzieci:**
- Specjalne miejsca dla dzieci
- Kącik zabaw (przed meczem i w przerwie)
- Animatorzy dla dzieci
- Bezpłatne przekąski dla dzieci

**Dla rodziców:**
- Szerokie przejścia dla wózków
- Miejsca parkingowe przy wejściu
- Pokój dla matek karmiących
- Toalety dostosowane dla rodzin

## Rekomendacje przy wejściu
**Przygotowanie:**
- Przyjedź 30 minut wcześniej
- Zabierz dokumenty tożsamości
- Sprawdź czy masz wszystkie bilety
- Przygotuj się na kontrolę bezpieczeństwa

**Z wózkami:**
- Wózek można zostawić w specjalnym miejscu
- Zabierz niezbędne rzeczy do torby
- Rozważ nosidełko dla dziecka

**Z małymi dziećmi:**
- Zabierz przekąski i napoje
- Weź zabawki (bez dźwięku)
- Rozważ słuchawki ochronne

## Zasady zachowania
- Szanuj innych rodziców i dzieci
- Nie używaj wulgarnego języka
- Nie pal tytoniu w sektorze rodzinnym
- Przestrzegaj poleceń służb porządkowych

## Kontakt
W przypadku pytań o sektor rodzinny:
- E-mail: rodziny@widzew.com
- Telefon: +48 42 123 45 68`,
      status: "published",
      tags: JSON.stringify(["rodziny", "dzieci", "sektor", "udogodnienia", "zachowanie"]
    },
    {
      title: "Sektor gości",
      slug: "sektor-gosci",
      markdown: `# Sektor gości na stadionie Widzew

## Lokalizacja
Sektor gości znajduje się w trybunie **"Niciarka"** i ma **907 miejsc**.

## Wejścia
- **Główne wejście:** Bramą C od strony ul. Żeromskiego
- **Alternatywne wejście:** Bramą D od strony ul. Narutowicza
- Specjalne oznakowanie dla kibiców gości

## Limity i zasady
**Limity miejsc:**
- Maksymalnie 907 kibiców gości
- Bilety dostępne tylko przez klub gości
- Brak możliwości zakupu biletów na miejscu

**Zasady specjalne:**
- Obowiązkowa kontrola tożsamości
- Zabronione wnoszenie materiałów promocyjnych
- Specjalny regulamin dla kibiców gości
- Obowiązkowe zachowanie spokoju

## Bezpieczeństwo
- Własna służba porządkowa
- Oddzielne toalety i punkty gastronomiczne
- Specjalne wyjście ewakuacyjne
- Monitoring 24/7

## Kontakt z klubem gości
- Informacje o biletach tylko przez klub gości
- Widzew Łódź nie sprzedaje biletów dla kibiców gości
- W przypadku problemów kontakt z BOK klubu gości`,
      status: "published",
      tags: JSON.stringify(["goście", "sektor", "limity", "bezpieczeństwo", "bilety"]
    },
    {
      title: "Bezpieczeństwo i pomoc",
      slug: "bezpieczenstwo-pomoc",
      markdown: `# Bezpieczeństwo i pomoc na stadionie Widzew

## Punkty medyczne
**Główny punkt medyczny:**
- Lokalizacja: przy Bramie A
- Godziny: 2 godziny przed meczem - 1 godzina po meczu
- Personel: lekarz + 2 pielęgniarki
- Wyposażenie: podstawowy sprzęt medyczny

**Punkty pomocnicze:**
- Trybuna "Pod Zegarem" - pielęgniarka
- Trybuna "Prosta" - pielęgniarka
- Trybuna "Niciarka" - pielęgniarka
- Trybuna "Kryta" - pielęgniarka

## Rzeczy znalezione
**Gdzie zgłosić:**
- Punkt informacyjny przy Bramie A
- Służby porządkowe na trybunach
- Biuro Obsługi Klienta

**Jak odzyskać:**
- Opisz zgubiony przedmiot
- Podaj przybliżoną lokalizację
- Zostaw dane kontaktowe
- Sprawdź w ciągu 7 dni

## Kontakt BOK
**Biuro Obsługi Klienta:**
- Telefon: +48 42 123 45 67
- E-mail: bok@widzew.com
- Godziny: 9:00-17:00 (pon-pt)

**Podczas meczów:**
- Punkt informacyjny przy Bramie A
- Telefon: +48 42 123 45 68
- Godziny: 2 godziny przed meczem - 1 godzina po meczu

## Służby porządkowe
- Widoczni w żółtych kamizelkach
- Dostępni na wszystkich trybunach
- Wyposażeni w radiotelefony
- Współpracują z policją

## W przypadku zagrożenia
1. Zachowaj spokój
2. Słuchaj poleceń służb porządkowych
3. Użyj najbliższego wyjścia ewakuacyjnego
4. Pomóż osobom starszym i dzieciom
5. Po opuszczeniu stadionu udaj się w bezpieczne miejsce`,
      status: "published",
      tags: JSON.stringify(["bezpieczeństwo", "pomoc", "medyczne", "rzeczy", "kontakt"]
    }
  ]

  for (const article of articles) {
    const createdArticle = await prisma.knowledgeArticle.create({
      data: article
    })

    // Generate chunks and embeddings
    const chunks = article.markdown
      .split(/\n\s*\n/)
      .filter(chunk => chunk.trim().length > 50)
      .map(chunk => chunk.trim())

    for (const chunkContent of chunks) {
      // Mock embedding for development (smaller for SQLite)
      const embedding = Array(100).fill(0).map(() => Math.random() - 0.5)
      
      await prisma.articleChunk.create({
        data: {
          articleId: createdArticle.id,
          content: chunkContent,
          embedding: JSON.stringify(embedding)
        }
      })
    }
  }

  console.log('✅ Knowledge articles created')

  // Create contacts
  const contacts = []
  const cities = ['Łódź', 'Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice']
  const firstNames = ['Jan', 'Anna', 'Piotr', 'Maria', 'Tomasz', 'Katarzyna', 'Michał', 'Agnieszka', 'Paweł', 'Magdalena']
  const lastNames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Dąbrowski', 'Lewandowski', 'Wójcik', 'Kamiński', 'Kowalczyk', 'Zieliński', 'Szymański']

  for (let i = 0; i < 300; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const hasSeasonPass = Math.random() < 0.3
    const isNewFan = Math.random() < 0.2
    const isShopCustomer = Math.random() < 0.4

    const tags = []
    if (hasSeasonPass) tags.push('karnetowicz')
    if (isNewFan) tags.push('nowy')
    if (isShopCustomer) tags.push('sklep')

    const contact = await prisma.contact.create({
      data: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+48 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        firstName,
        lastName,
        city,
        tags: JSON.stringify(tags),
        customFields: JSON.stringify({
          seasonPass: hasSeasonPass,
          lastShopOrderAt: isShopCustomer ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
          lastMatchDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }),
        optInEmail: Math.random() < 0.8,
        optInSMS: Math.random() < 0.6,
        optInPush: Math.random() < 0.4
      }
    })
    contacts.push(contact)
  }

  console.log('✅ Contacts created')

  // Create segments
  const segments = [
    {
      name: "Karnetowicze",
      rules: JSON.stringify({ customFields: { path: ["seasonPass"], equals: true } })
    },
    {
      name: "Nowi kibice",
      rules: JSON.stringify({ createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    },
    {
      name: "Klienci sklepu",
      rules: JSON.stringify({ customFields: { path: ["lastShopOrderAt"], not: null } })
    }
  ]

  for (const segment of segments) {
    await prisma.segment.create({
      data: segment
    })
  }

  console.log('✅ Segments created')

  // Create sample conversations
  const sampleQuestions = [
    "Jakie są godziny otwarcia sklepu klubowego?",
    "Gdzie mogę zaparkować samochód na mecz?",
    "Czy mogę wnieść jedzenie na stadion?",
    "Jak kupić bilet na mecz?",
    "Gdzie znajduje się sektor rodzinny?",
    "Jakie są zasady wnoszenia przedmiotów na stadion?",
    "Czy jest parking dla osób niepełnosprawnych?",
    "Jak włączyć powiadomienia o zmianach terminów?",
    "Gdzie znajduje się punkt medyczny?",
    "Jakie są godziny otwarcia kas biletowych?"
  ]

  for (let i = 0; i < 25; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)]
    const question = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
    
    const conversation = await prisma.conversation.create({
      data: {
        channel: Channel.WEB,
        contactId: contact.id
      }
    })

    // User message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        from: MessageFrom.USER,
        content: question
      }
    })

    // Bot response
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        from: MessageFrom.BOT,
        content: `Dziękuję za pytanie! ${question} - to ważna informacja dla kibiców Widzewa Łódź. Sprawdź szczegóły w naszej bazie wiedzy lub skontaktuj się z Biurem Obsługi Klienta.`
      }
    })
  }

  console.log('✅ Sample conversations created')

  // Create sample tickets
  for (let i = 0; i < 10; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)]
    const assignee = bokUsers[Math.floor(Math.random() * bokUsers.length)]
    
    await prisma.ticket.create({
      data: {
        subject: `Zapytanie od ${contact.firstName} ${contact.lastName}`,
        status: TicketStatus.NEW,
        priority: TicketPriority.MEDIUM,
        assigneeId: assignee.id,
        contactId: contact.id
      }
    })
  }

  console.log('✅ Sample tickets created')

  // Create provider configs
  const providerConfigs = [
    {
      type: 'EMAIL',
      settings: JSON.stringify({
        host: 'localhost',
        port: 1025,
        secure: false
      }),
      enabled: true
    },
    {
      type: 'SMS',
      settings: JSON.stringify({
        provider: 'twilio',
        accountSid: '',
        authToken: ''
      }),
      enabled: false
    },
    {
      type: 'PUSH',
      settings: JSON.stringify({
        vapidPublicKey: '',
        vapidPrivateKey: '',
        vapidSubject: 'mailto:admin@widzew.com'
      }),
      enabled: false
    },
    {
      type: 'AI',
      settings: JSON.stringify({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        embeddingModel: 'text-embedding-3-small'
      }),
      enabled: true
    },
    {
      type: 'MAUTIC',
      settings: JSON.stringify({
        baseUrl: '',
        username: '',
        password: ''
      }),
      enabled: false
    }
  ]

  for (const config of providerConfigs) {
    await prisma.providerConfig.create({
      data: config
    })
  }

  console.log('✅ Provider configs created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
