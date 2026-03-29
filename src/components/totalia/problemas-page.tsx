"use client"

import { useProblems } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descrição", type: "textarea" as const },
  { key: "origin", label: "Origem" },
  { key: "impact", label: "Impacto", type: "select" as const, options: ["Baixo", "Médio", "Alto"] },
  { key: "status", label: "Status", type: "select" as const, options: ["identificado", "em_analise", "em_resolucao", "resolvido", "descartado"] },
  { key: "assigned_to", label: "Responsável" },
]

export default function ProblemasPage() {
  const { problems, loading, createProblem, updateProblem, deleteProblem } = useProblems()

  return (
    <SimpleListPage
      title="Problemas"
      description="Registro e acompanhamento de problemas"
      icon={<AlertTriangle className="h-5 w-5" />}
      items={problems}
      loading={loading}
      fields={fields}
      onAdd={createProblem}
      onUpdate={updateProblem}
      onDelete={deleteProblem}
      itemToForm={(item) => ({
        title: item.title,
        description: item.description ?? "",
        origin: item.origin ?? "",
        impact: item.impact ?? "",
        status: item.status,
        assigned_to: item.assignedTo ?? "",
      })}
      displayFields={(item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium">{item.title}</p>
            {item.impact && <Badge variant={item.impact === "Alto" ? "destructive" : "secondary"}>{item.impact}</Badge>}
            <Badge variant="outline">{item.status}</Badge>
          </div>
          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        </div>
      )}
    />
  )
}
