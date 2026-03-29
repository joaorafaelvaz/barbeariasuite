"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Scissors,
  UtensilsCrossed,
  MessageSquare,
  Camera,
  Database,
  LayoutDashboard,
  Sparkles,
  Settings,
  Users,
  Building2,
  Home,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Module } from "@/generated/prisma/enums"

type SidebarProps = {
  modules: Module[]
  canManageUsers: boolean
}

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  module?: Module
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Visao Geral",
    items: [
      { label: "Dashboard", href: "/", icon: Home },
    ],
  },
  {
    label: "Operacao",
    items: [
      { label: "Barbearia VIP", href: "/barbershop", icon: Scissors, module: "BARBERSHOP" },
      { label: "Gestao Totalia", href: "/totalia", icon: LayoutDashboard, module: "TOTALIA" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "LinkFood", href: "/linkfood", icon: UtensilsCrossed, module: "LINKFOOD" },
      { label: "Instagram Bot", href: "/instagram", icon: Sparkles, module: "INSTAGRAM" },
      { label: "WhatsApp Send", href: "/wahasend", icon: MessageSquare, module: "WAHASEND" },
    ],
  },
  {
    label: "Dados & Analytics",
    items: [
      { label: "VIP Data", href: "/vip-data", icon: Database, module: "VIP_DATA" },
      { label: "VIP Cam", href: "/vipcam", icon: Camera, module: "VIPCAM" },
    ],
  },
]

const settingsItems: NavItem[] = [
  { label: "Minha Conta", href: "/settings", icon: Settings },
  { label: "Unidades", href: "/settings/units", icon: Building2 },
  { label: "Usuarios", href: "/settings/users", icon: Users },
]

export function Sidebar({ modules, canManageUsers }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Scissors className="h-6 w-6 text-sidebar-primary" />
        <span className="text-lg font-bold">BarbeariaSuite</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.module || modules.includes(item.module)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {visibleItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )
        })}

        <Separator className="my-2" />

        <div className="mb-4">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Configuracoes
          </p>
          {settingsItems.map((item) => {
            if (item.href === "/settings/users" && !canManageUsers) return null

            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </aside>
  )
}
