"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  CheckSquare,
  DollarSign,
  Target,
  Layers,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Megaphone,
  Calendar,
  ShoppingCart,
  Bot,
} from "lucide-react"

const modules = [
  { href: "/totalia/planejamento", icon: Target, label: "Planejamento Estratégico", desc: "Missão, visão, SWOT e objetivos" },
  { href: "/totalia/processos", icon: Layers, label: "Processos", desc: "Mapeamento e gestão de processos" },
  { href: "/totalia/tarefas", icon: CheckSquare, label: "Tarefas", desc: "Gestão de tarefas e entregas" },
  { href: "/totalia/colaboradores", icon: Users, label: "Colaboradores", desc: "Equipe e recursos humanos" },
  { href: "/totalia/financeiro", icon: DollarSign, label: "Financeiro", desc: "Contas a pagar e receber" },
  { href: "/totalia/marketing", icon: Megaphone, label: "Marketing", desc: "Campanhas e estratégias" },
  { href: "/totalia/reunioes", icon: Calendar, label: "Reuniões", desc: "Agenda e atas de reuniões" },
  { href: "/totalia/compras", icon: ShoppingCart, label: "Compras", desc: "Pedidos e fornecedores" },
  { href: "/totalia/problemas", icon: AlertTriangle, label: "Problemas", desc: "Registro e acompanhamento" },
  { href: "/totalia/oportunidades", icon: Lightbulb, label: "Oportunidades", desc: "Pipeline de oportunidades" },
  { href: "/totalia/riscos", icon: ShieldAlert, label: "Riscos", desc: "Gestão de riscos" },
  { href: "/totalia/ia-conselheiro", icon: Bot, label: "IA Conselheiro", desc: "Assistente inteligente" },
]

export default function TotaliaDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão Totalia</h1>
        <p className="text-muted-foreground">Plataforma de gestão empresarial completa</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
