"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  Users, 
  BookOpen, 
  Target, 
  Mail, 
  Settings,
  BarChart3
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Rozmowy",
    href: "/admin/conversations",
    icon: MessageSquare,
  },
  {
    name: "Tickets BOK",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    name: "Kontakty",
    href: "/admin/contacts",
    icon: Users,
  },
  {
    name: "Baza wiedzy",
    href: "/admin/knowledge",
    icon: BookOpen,
  },
  {
    name: "Segmenty",
    href: "/admin/segments",
    icon: Target,
  },
  {
    name: "Broadcast",
    href: "/admin/broadcast",
    icon: Mail,
  },
  {
    name: "Raporty",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Ustawienia",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-red-50 text-red-700 border-r-2 border-red-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
