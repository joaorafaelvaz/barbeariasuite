"use client"

import { useProcesses } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const fields = [
  { key: "name", label: "Nome", required: true },
  { key: "type", label: "Tipo", type: "select" as const, options: ["principal", "apoio"] },
  { key: "area", label: "Área" },
  { key: "description", label: "Descrição", type: "textarea" as const },
  { key: "objective", label: "Objetivo", type: "textarea" as const },
  { key: "status", label: "Status", type: "select" as const, options: ["ativo", "inativo", "em_revisao"] },
  { key: "estimated_duration", label: "Duração Estimada" },
]

export default function ProcessosPage() {
  const { processes, loading, createProcess, updateProcess, deleteProcess } = useProcesses()

  return (
    <SimpleListPage
      title="Processos"
      description="Mapeamento e gestão de processos"
      icon={<Layers className="h-5 w-5" />}
      items={processes}
      loading={loading}
      fields={fields}
      onAdd={createProcess}
      onUpdate={updateProcess}
      onDelete={deleteProcess}
      itemToForm={(item) => ({
        name: item.name,
        type: item.type,
        area: item.area ?? "",
        description: item.description ?? "",
        objective: item.objective ?? "",
        status: item.status,
        estimated_duration: item.estimatedDuration ?? "",
      })}
      displayFields={(item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium">{item.name}</p>
            <Badge variant="outline">{item.type}</Badge>
            <Badge variant={item.status === "ativo" ? "default" : "secondary"}>{item.status}</Badge>
          </div>
          {item.area && <p className="text-xs text-muted-foreground">Área: {item.area}</p>}
          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        </div>
      )}
    />
  )
}
