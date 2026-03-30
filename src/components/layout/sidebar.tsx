"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  Scissors,
  UtensilsCrossed,
  MessageSquare,
  Camera,
  Database,
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  Home,
  BarChart2,
  User,
  DollarSign,
  Target,
  Percent,
  Star,
  Store,
  Plug,
  Bot,
  FileText,
  ClipboardCheck,
  UserCheck,
  Eye,
  Wrench,
  CalendarDays,
  RefreshCw,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
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

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:      "Super Admin",
  FRANQUEADOR:      "Franqueador",
  MULTIFRANQUEADO:  "Multi-franqueado",
  COLABORADOR:      "Colaborador",
  GERENTE:          "Gerente",
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Visão Geral",
    items: [
      { label: "Dashboard", href: "/", icon: Home },
    ],
  },
  {
    label: "Barbearia VIP",
    items: [
      { label: "Dashboard",     href: "/barbershop",              icon: BarChart2,  module: "BARBERSHOP" },
      { label: "Colaboradores", href: "/barbershop/colaboradores", icon: User,       module: "BARBERSHOP" },
      { label: "Clientes",      href: "/barbershop/clientes",      icon: Users,      module: "BARBERSHOP" },
      { label: "Vendas",        href: "/barbershop/vendas",        icon: DollarSign, module: "BARBERSHOP" },
      { label: "Metas",         href: "/barbershop/metas",         icon: Target,     module: "BARBERSHOP" },
      { label: "Comissões",     href: "/barbershop/comissoes",     icon: Percent,    module: "BARBERSHOP" },
    ],
  },
  {
    label: "Operação",
    items: [
      { label: "Gestão Total IA", href: "/totalia", icon: LayoutDashboard, module: "TOTALIA" },
    ],
  },
  {
    label: "Reputação",
    items: [
      { label: "Dashboard",       href: "/linkfood",              icon: Star,             module: "LINKFOOD" },
      { label: "Estabelecimentos",href: "/linkfood/businesses",   icon: Store,            module: "LINKFOOD" },
      { label: "Avaliações",      href: "/linkfood/reviews",      icon: MessageSquare,    module: "LINKFOOD" },
      { label: "Integrações",     href: "/linkfood/integrations", icon: Plug,             module: "LINKFOOD" },
    ],
  },
  {
    label: "Instagram",
    items: [
      { label: "Dashboard",    href: "/instagram",              icon: Bot,          module: "INSTAGRAM" },
      { label: "Aprovações",   href: "/instagram/aprovacoes",   icon: ClipboardCheck, module: "INSTAGRAM" },
      { label: "Boas-vindas",  href: "/instagram/bem-vindos",   icon: UserCheck,    module: "INSTAGRAM" },
      { label: "Monitoramento",href: "/instagram/monitoramento",icon: Eye,          module: "INSTAGRAM" },
      { label: "Logs",         href: "/instagram/logs",         icon: FileText,     module: "INSTAGRAM" },
      { label: "Configuração", href: "/instagram/config",       icon: Settings,     module: "INSTAGRAM" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "WhatsApp Send", href: "/wahasend", icon: MessageSquare, module: "WAHASEND" },
    ],
  },
  {
    label: "VIP Data",
    items: [
      { label: "Dashboard",     href: "/vip-data",               icon: Database,    module: "VIP_DATA" },
      { label: "Serviços",      href: "/vip-data/servicos",      icon: Wrench,      module: "VIP_DATA" },
      { label: "Relatórios",    href: "/vip-data/relatorios",    icon: FileText,    module: "VIP_DATA" },
      { label: "Calendário",    href: "/vip-data/calendario",    icon: CalendarDays,module: "VIP_DATA" },
      { label: "Sincronização", href: "/vip-data/sincronizacao", icon: RefreshCw,   module: "VIP_DATA" },
    ],
  },
  {
    label: "VIP Cam",
    items: [
      { label: "Dashboard",    href: "/vipcam",          icon: Camera,           module: "VIPCAM" },
      { label: "Câmeras",      href: "/vipcam/cameras",  icon: Eye,              module: "VIPCAM" },
      { label: "Pessoas",      href: "/vipcam/pessoas",  icon: Users,            module: "VIPCAM" },
      { label: "Analytics",    href: "/vipcam/analytics",icon: BarChart3,        module: "VIPCAM" },
      { label: "Configuração", href: "/vipcam/settings", icon: SlidersHorizontal,module: "VIPCAM" },
    ],
  },
]

const settingsItems: NavItem[] = [
  { label: "Minha Conta", href: "/settings",       icon: User },
  { label: "Unidades",    href: "/settings/units", icon: Building2 },
  { label: "Usuários",    href: "/settings/users", icon: Users },
]

const EXACT_HREFS = ["/", "/barbershop", "/totalia", "/linkfood", "/instagram", "/vip-data", "/vipcam"]

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-all duration-100",
        active
          ? "bg-[oklch(0.76_0.14_78/0.09)] text-sidebar-primary font-medium"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-[55%] w-[2.5px] -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
      )}
      <item.icon
        className={cn(
          "h-[15px] w-[15px] shrink-0 transition-colors",
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
        )}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

export function Sidebar({ modules, canManageUsers }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  const initials =
    user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"
  const roleLabel = ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? ""

  function isActive(href: string) {
    return EXACT_HREFS.includes(href) ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.76_0.14_78/0.14)] ring-1 ring-[oklch(0.76_0.14_78/0.3)]">
          <Scissors className="h-3.5 w-3.5 text-sidebar-primary" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">
          BarbeariaSuite
        </span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        <nav className="px-2.5 space-y-0.5">
          {navGroups.map((group) => {
            const visible = group.items.filter(
              (i) => !i.module || modules.includes(i.module)
            )
            if (!visible.length) return null

            return (
              <div key={group.label} className="mb-3.5">
                <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-primary/40">
                  {group.label}
                </p>
                {visible.map((item) => (
                  <NavLink key={item.href} item={item} active={isActive(item.href)} />
                ))}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Configurações */}
      <div className="border-t border-sidebar-border px-2.5 pt-2.5 pb-2">
        <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-primary/40">
          Configurações
        </p>
        {settingsItems.map((item) => {
          if (item.href === "/settings/users" && !canManageUsers) return null
          return (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          )
        })}
      </div>

      {/* Usuário */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.76_0.14_78/0.12)] text-[10px] font-bold text-sidebar-primary ring-1 ring-[oklch(0.76_0.14_78/0.25)]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              {user?.name ?? "—"}
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/45">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
