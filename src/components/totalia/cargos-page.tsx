"use client"

import { useCargos } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"

const fields = [
  { key: "nome", label: "Nome", required: true },
  { key: "area", label: "Área" },
  { key: "nivel", label: "Nível" },
  { key: "descricao", label: "Descrição", type: "textarea" as const },
  { key: "salario_min", label: "Salário Mínimo" },
  { key: "salario_max", label: "Salário Máximo" },
]

export default function CargosPage() {
  const { cargos, loading, addCargo, updateCargo, deleteCargo } = useCargos()

  return (
    <SimpleListPage
      title="Cargos"
      description="Estrutura de cargos e funções"
      icon={<Briefcase className="h-5 w-5" />}
      items={cargos}
      loading={loading}
      fields={fields}
      onAdd={addCargo}
      onUpdate={updateCargo}
      onDelete={deleteCargo}
      itemToForm={(c) => ({
        nome: c.nome,
        area: c.area ?? "",
        nivel: c.nivel ?? "",
        descricao: c.descricao ?? "",
        salario_min: c.salarioMin ? String(c.salarioMin) : "",
        salario_max: c.salarioMax ? String(c.salarioMax) : "",
      })}
      displayFields={(c) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{c.nome}</p>
            {c.area && <Badge variant="outline">{c.area}</Badge>}
            {c.nivel && <Badge variant="secondary">{c.nivel}</Badge>}
          </div>
          {c.descricao && <p className="text-sm text-muted-foreground line-clamp-2">{c.descricao}</p>}
          {(c.salarioMin || c.salarioMax) && (
            <p className="text-xs text-muted-foreground">
              Faixa: {c.salarioMin ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c.salarioMin) : "—"} –{" "}
              {c.salarioMax ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c.salarioMax) : "—"}
            </p>
          )}
        </div>
      )}
    />
  )
}
