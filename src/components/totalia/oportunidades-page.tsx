"use client"

import { useOpportunities } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descrição", type: "textarea" as const },
  { key: "origin", label: "Origem" },
  { key: "probability", label: "Probabilidade", type: "select" as const, options: ["Baixa", "Média", "Alta"] },
  { key: "impact", label: "Impacto", type: "select" as const, options: ["Baixo", "Médio", "Alto"] },
  { key: "status", label: "Status", type: "select" as const, options: ["identificada", "em_analise", "aprovada", "implementada", "descartada"] },
  { key: "assigned_to", label: "Responsável" },
]

export default function OportunidadesPage() {
  const { opportunities, loading, createOpportunity, updateOpportunity, deleteOpportunity } = useOpportunities()

  return (
    <SimpleListPage
      title="Oportunidades"
      description="Pipeline de oportunidades identificadas"
      icon={<Lightbulb className="h-5 w-5" />}
      items={opportunities}
      loading={loading}
      fields={fields}
      onAdd={createOpportunity}
      onUpdate={updateOpportunity}
      onDelete={deleteOpportunity}
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
            {item.impact && <Badge>{item.impact}</Badge>}
            <Badge variant="outline">{item.status}</Badge>
          </div>
          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        </div>
      )}
    />
  )
}
