"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UnitSelector } from "./unit-selector"

type HeaderProps = {
  units: { id: string; name: string; networkName: string }[]
  selectedUnitId: string
  showAllOption: boolean
}

export function Header({ units, selectedUnitId, showAllOption }: HeaderProps) {
  const { data: session } = useSession()
  const user = session?.user

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <UnitSelector
          units={units}
          selectedUnitId={selectedUnitId}
          showAllOption={showAllOption}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
          <span className="text-sm font-medium">{user?.name}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => (window.location.href = "/settings")}
          >
            <User className="mr-2 h-4 w-4" />
            Minha Conta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
