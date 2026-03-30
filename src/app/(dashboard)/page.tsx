import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserModules } from "@/lib/permissions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Scissors,
  UtensilsCrossed,
  MessageSquare,
  Camera,
  Database,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"
import type { Module } from "@/generated/prisma/enums"

const moduleInfo: Record<Module, { label: string; description: string; icon: React.ComponentType<{ className?: string }>; href: string }> = {
  BARBERSHOP: {
    label: "Barbearia VIP",
    description: "CRM, agendamentos, analytics e gestao de clientes",
    icon: Scissors,
    href: "/barbershop",
  },
  TOTALIA: {
    label: "Gestão Total IA",
    description: "Sistema de gestao administrativa",
    icon: LayoutDashboard,
    href: "/totalia",
  },
  LINKFOOD: {
    label: "Reputação",
    description: "Gestão de avaliações e presença online",
    icon: UtensilsCrossed,
    href: "/linkfood",
  },
  INSTAGRAM: {
    label: "Instagram Bot",
    description: "Automacao de respostas e engajamento",
    icon: Sparkles,
    href: "/instagram",
  },
  WAHASEND: {
    label: "WhatsApp Send",
    description: "Envio de mensagens em massa via WhatsApp",
    icon: MessageSquare,
    href: "/wahasend",
  },
  VIP_DATA: {
    label: "VIP Data",
    description: "Plataforma de dados e integracoes",
    icon: Database,
    href: "/vip-data",
  },
  VIPCAM: {
    label: "VIP Cam",
    description: "Analise facial e monitoramento em tempo real",
    icon: Camera,
    href: "/vipcam",
  },
}

export default async function DashboardHome() {
  const session = await getServerSession(authOptions)
  const modules = await getUserModules()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bem-vindo, {session?.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Painel geral da BarbeariaSuite
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => {
          const info = moduleInfo[mod]
          const Icon = info.icon

          return (
            <a key={mod} href={info.href}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{info.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{info.description}</CardDescription>
                </CardContent>
              </Card>
            </a>
          )
        })}
      </div>

      {modules.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhum modulo disponivel. Contate o administrador para liberar
              acesso.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
