"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"

interface AdminHeaderProps {
  user: {
    id: string
    email: string
    name?: string
    role: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_%C5%81%C3%B3d%C5%BA.png" 
              alt="Widzew Łódź" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Widzew CRM</h1>
            <p className="text-sm text-gray-500">Panel administracyjny</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ustawienia</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Wyloguj</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
