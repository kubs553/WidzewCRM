import { AIProvider, ArticleChunk } from "@/types"
import { db } from "./db"

export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private model: string
  private embeddingModel: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
    this.model = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
    this.embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    if (!this.apiKey) {
      return "Przepraszam, ale nie mogę odpowiedzieć na Twoje pytanie w tej chwili. Spróbuj ponownie później."
    }

    try {
      const systemPrompt = `Jesteś asystentem AI dla klubu piłkarskiego Widzew Łódź. Odpowiadasz na pytania kibiców w języku polskim. 
      Używaj przyjaznego, profesjonalnego tonu. Jeśli nie znasz odpowiedzi, powiedz to szczerze i zasugeruj kontakt z biurem obsługi klienta.
      
      Kontekst: ${context || "Brak dodatkowego kontekstu"}
      
      Odpowiadaj krótko i na temat.`

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      return data.choices[0]?.message?.content || "Przepraszam, nie mogę wygenerować odpowiedzi."
    } catch (error) {
      console.error("OpenAI API error:", error)
      return "Przepraszam, wystąpił błąd podczas generowania odpowiedzi."
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      // Return mock embedding for development (smaller for SQLite)
      return Array(100).fill(0).map(() => Math.random() - 0.5)
    }

    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.embeddingModel,
          input: text,
        }),
      })

      const data = await response.json()
      return data.data[0]?.embedding || []
    } catch (error) {
      console.error("OpenAI embedding error:", error)
      // Return mock embedding for development (smaller for SQLite)
      return Array(100).fill(0).map(() => Math.random() - 0.5)
    }
  }

  async searchSimilarChunks(query: string, limit: number = 5): Promise<ArticleChunk[]> {
    // Generate embedding for the query
    const queryEmbedding = await this.generateEmbedding(query)
    
    // Get all chunks with embeddings
    const chunks = await db.articleChunk.findMany({
      include: {
        article: true
      }
    })

    // Calculate cosine similarity
    const similarities = chunks.map((chunk: any) => {
      let embedding: number[] = []
      try {
        embedding = typeof chunk.embedding === 'string' ? JSON.parse(chunk.embedding) : chunk.embedding
      } catch (error) {
        console.error('Error parsing embedding:', error)
        embedding = []
      }
      const similarity = this.cosineSimilarity(queryEmbedding, embedding)
      return { ...chunk, similarity }
    })

    // Sort by similarity and return top results
    return similarities
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(({ similarity, ...chunk }: any) => chunk)
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

export class MockAIProvider implements AIProvider {
  async generateResponse(prompt: string, context?: string): Promise<string> {
    const lowerPrompt = prompt.toLowerCase()
    
    // Pozdrowienia i podstawowe odpowiedzi
    if (lowerPrompt.includes('cześć') || lowerPrompt.includes('hej') || lowerPrompt.includes('witaj') || lowerPrompt.includes('dzień dobry')) {
      return "Cześć! 👋 Witaj w Widzewie Łódź! Jestem tutaj, żeby pomóc Ci z informacjami o klubie. O co chciałbyś zapytać?"
    }
    
    if (lowerPrompt.includes('dziękuję') || lowerPrompt.includes('dzięki')) {
      return "Nie ma za co! 😊 Zawsze chętnie pomogę kibicom Widzewa. Masz jeszcze jakieś pytania?"
    }
    
    if (lowerPrompt.includes('jak się masz') || lowerPrompt.includes('co słychać')) {
      return "Dziękuję, wszystko w porządku! 😊 Jestem gotowy pomóc Ci z informacjami o Widzewie Łódź. O czym chciałbyś porozmawiać?"
    }
    
    // Pytania o stadion
    if (lowerPrompt.includes('stadion') || lowerPrompt.includes('gdzie') || lowerPrompt.includes('adres')) {
      return "Stadion Miejski Widzewa Łódź (Serce Łodzi) znajduje się przy **al. Piłsudskiego 138, 92-300 Łódź**. Stadion ma pojemność 18 018 miejsc. Czy potrzebujesz informacji o dojeździe lub parkingach?"
    }
    
    // Pytania o bilety
    if (lowerPrompt.includes('bilet') || lowerPrompt.includes('karnet') || lowerPrompt.includes('wejściówka')) {
      return "Bilety na mecze Widzewa można kupić online na stronie klubu lub w kasach stadionu przed meczem. Karnety sezonowe są dostępne w biurze obsługi klienta. Potrzebujesz informacji o cenach lub dostępności?"
    }
    
    // Pytania o parking
    if (lowerPrompt.includes('parking') || lowerPrompt.includes('gdzie zaparkować')) {
      return "W okolicy stadionu są dostępne parkingi publiczne. Polecam przyjechać wcześniej, szczególnie na ważne mecze. Można też skorzystać z komunikacji miejskiej - przystanek 'Stadion Widzewa' jest tuż przy obiekcie."
    }
    
    // Pytania o sklep
    if (lowerPrompt.includes('sklep') || lowerPrompt.includes('gadżet') || lowerPrompt.includes('koszulka')) {
      return "Sklep klubowy Widzewa znajduje się przy stadionie. Jest otwarty od poniedziałku do piątku 10:00-18:00, w soboty 10:00-16:00. Można tam kupić koszulki, gadżety i inne pamiątki klubowe."
    }
    
    // Pytania o mecze
    if (lowerPrompt.includes('mecz') || lowerPrompt.includes('termin') || lowerPrompt.includes('kiedy')) {
      return "Terminy meczów Widzewa znajdziesz na oficjalnej stronie klubu lub w aplikacji mobilnej. Czy interesuje Cię konkretny mecz lub sezon?"
    }
    
    // Pytania o historię klubu
    if (lowerPrompt.includes('historia') || lowerPrompt.includes('kiedy powstał') || lowerPrompt.includes('rok')) {
      return "Widzew Łódź został założony w 1910 roku. To jeden z najstarszych klubów piłkarskich w Polsce z bogatą historią i tradycją. Klub ma wielu wiernych kibiców i ciekawą przeszłość."
    }
    
    // Jeśli nie ma kontekstu z bazy wiedzy, użyj ogólnych odpowiedzi
    if (context && context.trim()) {
      return `Na podstawie informacji o Widzewie Łódź: ${context}\n\nCzy to odpowiada na Twoje pytanie? Jeśli potrzebujesz więcej szczegółów, śmiało pytaj!`
    }
    
    // Ogólne odpowiedzi dla innych pytań
    const generalResponses = [
      "To ciekawe pytanie! Mogę pomóc Ci z informacjami o Widzewie Łódź - stadionie, biletach, sklepie klubowym czy historii klubu. O co konkretnie chciałbyś zapytać?",
      "Widzew Łódź to klub z bogatą tradycją! Mogę Ci pomóc z podstawowymi informacjami o klubie. Spróbuj zapytać o stadion, bilety, sklep klubowy lub historię.",
      "Świetnie, że interesujesz się Widzewem! 😊 Mogę pomóc Ci z informacjami o klubie. O czym chciałbyś się dowiedzieć?",
      "Widzew Łódź to wspaniały klub! Mogę Ci pomóc z informacjami o stadionie, biletach, sklepie klubowym czy dojeździe. O co chciałbyś zapytać?",
      "Cieszę się, że jesteś zainteresowany Widzewem! 🏆 Mogę pomóc Ci z podstawowymi informacjami o klubie. Spróbuj zapytać o konkretny temat!"
    ]
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Return mock embedding (smaller for SQLite)
    return Array(100).fill(0).map(() => Math.random() - 0.5)
  }

  async searchSimilarChunks(query: string, limit: number = 5): Promise<ArticleChunk[]> {
    // Return mock chunks based on query
    const lowerQuery = query.toLowerCase()
    
    const mockChunks = [
      {
        id: "mock-1",
        articleId: "mock-article-1",
        content: "Stadion Miejski Widzewa Łódź znajduje się przy al. Piłsudskiego 138, 92-300 Łódź. Stadion jest również znany jako 'Serce Łodzi' i ma pojemność 18 018 miejsc.",
        embedding: Array(100).fill(0).map(() => Math.random() - 0.5),
        article: {
          id: "mock-article-1",
          title: "Wejścia na Stadion Miejski Widzewa Łódź",
          slug: "wejscia-na-stadion",
          markdown: "",
          status: "published",
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          chunks: []
        }
      },
      {
        id: "mock-2", 
        articleId: "mock-article-2",
        content: "Bilety na mecze Widzewa można kupić online na stronie klubu lub w kasach stadionu przed meczem. Karnety sezonowe są dostępne w biurze obsługi klienta.",
        embedding: Array(100).fill(0).map(() => Math.random() - 0.5),
        article: {
          id: "mock-article-2",
          title: "Bilety i karnety",
          slug: "bilety-i-karnety",
          markdown: "",
          status: "published", 
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          chunks: []
        }
      },
      {
        id: "mock-3",
        articleId: "mock-article-3", 
        content: "Sklep klubowy Widzewa znajduje się przy stadionie. Jest otwarty od poniedziałku do piątku 10:00-18:00, w soboty 10:00-16:00.",
        embedding: Array(100).fill(0).map(() => Math.random() - 0.5),
        article: {
          id: "mock-article-3",
          title: "Sklep oficjalny",
          slug: "sklep-oficjalny",
          markdown: "",
          status: "published",
          tags: [], 
          createdAt: new Date(),
          updatedAt: new Date(),
          chunks: []
        }
      }
    ]
    
    // Filter chunks based on query relevance
    let relevantChunks = mockChunks
    
    if (lowerQuery.includes('stadion') || lowerQuery.includes('gdzie') || lowerQuery.includes('adres')) {
      relevantChunks = [mockChunks[0]]
    } else if (lowerQuery.includes('bilet') || lowerQuery.includes('karnet')) {
      relevantChunks = [mockChunks[1]]
    } else if (lowerQuery.includes('sklep') || lowerQuery.includes('gadżet')) {
      relevantChunks = [mockChunks[2]]
    }
    
    return relevantChunks.slice(0, limit)
  }
}

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "openai"
  
  switch (provider) {
    case "openai":
      return new OpenAIProvider()
    case "mock":
    default:
      return new MockAIProvider()
  }
}
