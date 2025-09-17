import { NotificationProvider } from "@/types"
import nodemailer from "nodemailer"
import webpush from "web-push"

export class EmailProvider implements NotificationProvider {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "localhost",
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: false,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })
  }

  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@widzew.com",
        to,
        subject,
        html: content,
      })
      return true
    } catch (error) {
      console.error("Email sending error:", error)
      return false
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    // Email provider doesn't handle SMS
    return false
  }

  async sendPush(token: string, title: string, body: string): Promise<boolean> {
    // Email provider doesn't handle push notifications
    return false
  }
}

export class TwilioSMSProvider implements NotificationProvider {
  private accountSid: string
  private authToken: string
  private phoneNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ""
    this.authToken = process.env.TWILIO_AUTH_TOKEN || ""
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || ""
  }

  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    // SMS provider doesn't handle email
    return false
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken) {
      console.log(`[MOCK SMS] To: ${to}, Message: ${message}`)
      return true // Mock success for development
    }

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: to,
            From: this.phoneNumber,
            Body: message,
          }),
        }
      )

      return response.ok
    } catch (error) {
      console.error("SMS sending error:", error)
      return false
    }
  }

  async sendPush(token: string, title: string, body: string): Promise<boolean> {
    // SMS provider doesn't handle push notifications
    return false
  }
}

export class WebPushProvider implements NotificationProvider {
  constructor() {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidSubject = process.env.VAPID_SUBJECT

    if (vapidPublicKey && vapidPrivateKey && vapidSubject) {
      webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
    }
  }

  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    // Push provider doesn't handle email
    return false
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    // Push provider doesn't handle SMS
    return false
  }

  async sendPush(token: string, title: string, body: string): Promise<boolean> {
    try {
      const payload = JSON.stringify({
        title,
        body,
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        data: {
          url: "/",
        },
      })

      await webpush.sendNotification(JSON.parse(token), payload)
      return true
    } catch (error) {
      console.error("Push notification error:", error)
      return false
    }
  }
}

export class MockNotificationProvider implements NotificationProvider {
  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`)
    console.log(`[MOCK EMAIL] Content: ${content}`)
    return true
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    console.log(`[MOCK SMS] To: ${to}, Message: ${message}`)
    return true
  }

  async sendPush(token: string, title: string, body: string): Promise<boolean> {
    console.log(`[MOCK PUSH] Token: ${token}, Title: ${title}, Body: ${body}`)
    return true
  }
}

export function getNotificationProvider(type: "email" | "sms" | "push"): NotificationProvider {
  const provider = process.env.NOTIFICATION_PROVIDER || "mock"
  
  switch (provider) {
    case "email":
      return new EmailProvider()
    case "sms":
      return new TwilioSMSProvider()
    case "push":
      return new WebPushProvider()
    case "mock":
    default:
      return new MockNotificationProvider()
  }
}
