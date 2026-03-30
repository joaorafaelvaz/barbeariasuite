"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, Settings } from "lucide-react"
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

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur-sm">
      <UnitSelector
        units={units}
        selectedUnitId={selectedUnitId}
        showAllOption={showAllOption}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
          <span className="hidden text-sm text-foreground/70 sm:block">
            {user?.name}
          </span>
          <Avatar className="h-7 w-7 ring-1 ring-[oklch(0.76_0.14_78/0.35)]">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-[oklch(0.76_0.14_78/0.12)] text-[10px] font-bold text-[oklch(0.76_0.14_78)]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <div className="px-2 py-2">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
            <Settings className="mr-2 h-3.5 w-3.5" />
            Minha Conta
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
