import { UserRole, Channel, MessageFrom, TicketStatus, TicketPriority, NotificationType, NotificationStatus, ProviderType, TaskStatus, DealStage } from "@prisma/client"

export type {
  UserRole,
  Channel,
  MessageFrom,
  TicketStatus,
  TicketPriority,
  NotificationType,
  NotificationStatus,
  ProviderType,
  TaskStatus,
  DealStage,
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  id: string
  channel: Channel
  contactId?: string
  userId?: string
  createdAt: Date
  updatedAt: Date
  contact?: Contact
  user?: User
  messages: Message[]
  tickets: Ticket[]
}

export interface Message {
  id: string
  conversationId: string
  from: MessageFrom
  content: string
  rating?: number
  userId?: string
  createdAt: Date
  conversation?: Conversation
  user?: User
}

export interface KnowledgeArticle {
  id: string
  title: string
  slug: string
  markdown: string
  status: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  chunks: ArticleChunk[]
}

export interface ArticleChunk {
  id: string
  articleId: string
  content: string
  embedding: number[]
  article?: KnowledgeArticle
}

export interface Ticket {
  id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  assigneeId?: string
  contactId?: string
  conversationId?: string
  createdAt: Date
  updatedAt: Date
  assignee?: User
  contact?: Contact
  conversation?: Conversation
}

export interface Contact {
  id: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  tags: string[]
  customFields: Record<string, unknown>
  optInEmail: boolean
  optInSMS: boolean
  optInPush: boolean
  createdAt: Date
  updatedAt: Date
  conversations: Conversation[]
  tickets: Ticket[]
  deals: Deal[]
}

export interface Segment {
  id: string
  name: string
  rules: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface Deal {
  id: string
  title: string
  stage: DealStage
  value?: number
  ownerId: string
  contactId?: string
  createdAt: Date
  updatedAt: Date
  owner: User
  contact?: Contact
}

export interface Task {
  id: string
  title: string
  dueAt?: Date
  status: TaskStatus
  assigneeId: string
  relatedType?: string
  relatedId?: string
  createdAt: Date
  updatedAt: Date
  assignee: User
}

export interface Notification {
  id: string
  type: NotificationType
  to: string
  payload: Record<string, unknown>
  status: NotificationStatus
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProviderConfig {
  id: string
  type: ProviderType
  settings: Record<string, unknown>
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EventLog {
  id: string
  type: string
  payload: Record<string, unknown>
  createdAt: Date
}

// Chat widget types
export interface ChatMessage {
  id: string
  content: string
  from: 'user' | 'bot'
  timestamp: Date
  rating?: number
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  contactId?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Branding configuration
export interface BrandingConfig {
  clubName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo?: string
  defaultLanguage: string
}

// AI Provider types
export interface AIProvider {
  generateResponse(prompt: string, context?: string): Promise<string>
  generateEmbedding(text: string): Promise<number[]>
  searchSimilarChunks(query: string, limit?: number): Promise<ArticleChunk[]>
}

// Notification provider types
export interface NotificationProvider {
  sendEmail(to: string, subject: string, content: string): Promise<boolean>
  sendSMS(to: string, message: string): Promise<boolean>
  sendPush(token: string, title: string, body: string): Promise<boolean>
}

// Mautic integration types
export interface MauticContact {
  id?: number
  email?: string
  phone?: string
  firstname?: string
  lastname?: string
  city?: string
  tags?: string[]
  customFields?: Record<string, unknown>
}

export interface MauticClient {
  createContact(contact: MauticContact): Promise<MauticContact>
  updateContact(id: number, contact: Partial<MauticContact>): Promise<MauticContact>
  getContact(id: number): Promise<MauticContact>
  searchContacts(query: Record<string, unknown>): Promise<MauticContact[]>
  addTags(id: number, tags: string[]): Promise<void>
  removeTags(id: number, tags: string[]): Promise<void>
}
