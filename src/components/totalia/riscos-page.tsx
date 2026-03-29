"use client"

import { useRisks } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descrição", type: "textarea" as const },
  { key: "origin", label: "Origem" },
  { key: "probability", label: "Probabilidade", type: "select" as const, options: ["Baixa", "Média", "Alta"] },
  { key: "impact", label: "Impacto", type: "select" as const, options: ["Baixo", "Médio", "Alto"] },
  { key: "status", label: "Status", type: "select" as const, options: ["identificado", "em_analise", "mitigado", "resolvido"] },
  { key: "assigned_to", label: "Responsável" },
]

const IMPACT_COLORS: Record<string, any> = { Alto: "destructive", Médio: "default", Baixo: "secondary" }

export default function RiscosPage() {
  const { risks, loading, createRisk, updateRisk, deleteRisk } = useRisks()

  return (
    <SimpleListPage
      title="Riscos"
      description="Identificação e acompanhamento de riscos"
      icon={<ShieldAlert className="h-5 w-5" />}
      items={risks}
      loading={loading}
      fields={fields}
      onAdd={createRisk}
      onUpdate={updateRisk}
      onDelete={deleteRisk}
      itemToForm={(item) => ({
        title: item.title,
        description: item.description ?? "",
        origin: item.origin ?? "",
        probability: item.probability ?? "",
        impact: item.impact ?? "",
        status: item.status,
        assigned_to: item.assignedTo ?? "",
      })}
      displayFields={(item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium">{item.title}</p>
            {item.impact && <Badge variant={IMPACT_COLORS[item.impact] ?? "secondary"}>{item.impact}</Badge>}
            <Badge variant="outline">{item.status}</Badge>
          </div>
          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
          {item.assignedTo && <p className="text-xs text-muted-foreground">Responsável: {item.assignedTo}</p>}
        </div>
      )}
    />
  )
}
