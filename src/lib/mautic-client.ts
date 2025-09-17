import { MauticClient, MauticContact } from "@/types"

export class MauticAPIClient implements MauticClient {
  private baseUrl: string
  private username: string
  private password: string
  private token?: string

  constructor() {
    this.baseUrl = process.env.MAUTIC_BASE_URL || ""
    this.username = process.env.MAUTIC_USER || ""
    this.password = process.env.MAUTIC_PASSWORD || ""
  }

  private async authenticate(): Promise<string> {
    if (this.token) return this.token

    try {
      const response = await fetch(`${this.baseUrl}/api/oauth/v2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "password",
          client_id: "your_client_id",
          client_secret: "your_client_secret",
          username: this.username,
          password: this.password,
        }),
      })

      const data = await response.json()
      this.token = data.access_token
      return this.token
    } catch (error) {
      console.error("Mautic authentication error:", error)
      throw new Error("Failed to authenticate with Mautic")
    }
  }

  async createContact(contact: MauticContact): Promise<MauticContact> {
    if (!this.baseUrl) {
      console.log("[MOCK MAUTIC] Creating contact:", contact)
      return { ...contact, id: Math.floor(Math.random() * 1000) }
    }

    try {
      const token = await this.authenticate()
      const response = await fetch(`${this.baseUrl}/api/contacts/new`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })

      const data = await response.json()
      return data.contact
    } catch (error) {
      console.error("Mautic create contact error:", error)
      throw new Error("Failed to create contact in Mautic")
    }
  }

  async updateContact(id: number, contact: Partial<MauticContact>): Promise<MauticContact> {
    if (!this.baseUrl) {
      console.log(`[MOCK MAUTIC] Updating contact ${id}:`, contact)
      return { ...contact, id } as MauticContact
    }

    try {
      const token = await this.authenticate()
      const response = await fetch(`${this.baseUrl}/api/contacts/${id}/edit`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })

      const data = await response.json()
      return data.contact
    } catch (error) {
      console.error("Mautic update contact error:", error)
      throw new Error("Failed to update contact in Mautic")
    }
  }

  async getContact(id: number): Promise<MauticContact> {
    if (!this.baseUrl) {
      console.log(`[MOCK MAUTIC] Getting contact ${id}`)
      return { id, email: "mock@example.com", firstname: "Mock", lastname: "Contact" }
    }

    try {
      const token = await this.authenticate()
      const response = await fetch(`${this.baseUrl}/api/contacts/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()
      return data.contact
    } catch (error) {
      console.error("Mautic get contact error:", error)
      throw new Error("Failed to get contact from Mautic")
    }
  }

  async searchContacts(query: Record<string, unknown>): Promise<MauticContact[]> {
    if (!this.baseUrl) {
      console.log("[MOCK MAUTIC] Searching contacts:", query)
      return []
    }

    try {
      const token = await this.authenticate()
      const queryString = new URLSearchParams(query).toString()
      const response = await fetch(`${this.baseUrl}/api/contacts?${queryString}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()
      return data.contacts || []
    } catch (error) {
      console.error("Mautic search contacts error:", error)
      throw new Error("Failed to search contacts in Mautic")
    }
  }

  async addTags(id: number, tags: string[]): Promise<void> {
    if (!this.baseUrl) {
      console.log(`[MOCK MAUTIC] Adding tags to contact ${id}:`, tags)
      return
    }

    try {
      const token = await this.authenticate()
      await fetch(`${this.baseUrl}/api/contacts/${id}/tags`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      })
    } catch (error) {
      console.error("Mautic add tags error:", error)
      throw new Error("Failed to add tags in Mautic")
    }
  }

  async removeTags(id: number, tags: string[]): Promise<void> {
    if (!this.baseUrl) {
      console.log(`[MOCK MAUTIC] Removing tags from contact ${id}:`, tags)
      return
    }

    try {
      const token = await this.authenticate()
      await fetch(`${this.baseUrl}/api/contacts/${id}/tags`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      })
    } catch (error) {
      console.error("Mautic remove tags error:", error)
      throw new Error("Failed to remove tags in Mautic")
    }
  }
}

export function getMauticClient(): MauticClient {
  return new MauticAPIClient()
}
