"use client"

import { useState } from "react"
import { useMetasBarbershop, useColaboradoresBarbershop } from "@/lib/barbershop/hooks"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Target } from "lucide-react"

const TIPO_LABELS: Record<string, string> = {
  faturamento: "Faturamento",
  atendimentos: "Atendimentos",
  ticket_medio: "Ticket Médio",
  novos_clientes: "Novos Clientes",
}

function fmt(tipo: string, valor: number) {
  if (tipo === "faturamento" || tipo === "ticket_medio") {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }
  return String(valor)
}

export default function MetasPageBarbershop() {
  const now = new Date()
  const [ano, setAno] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)

  const { metas, loading, createMeta, updateMeta, deleteMeta } = useMetasBarbershop(mes, ano)
  const { colaboradores } = useColaboradoresBarbershop()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({
    tipo: "faturamento",
    valor: "",
    colaboradorId: "",
    mes,
    ano,
  })

  const resetForm = () =>
    setForm({ tipo: "faturamento", valor: "", colaboradorId: "", mes, ano })

  const handleCreate = async () => {
    if (!form.valor) return toast.error("Valor é obrigatório.")
    try {
      await createMeta(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar meta.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateMeta(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar meta.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover meta?")) return
    try {
      await deleteMeta(id)
    } catch {
      toast.error("Erro ao remover meta.")
    }
  }

  const openEdit = (m: any) => {
    setForm({
      tipo: m.tipo,
      valor: String(m.valor),
      colaboradorId: m.colaboradorId ?? "",
      mes: m.mes,
      ano: m.ano,
    })
    setEditing(m)
  }

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Metas</h1>
          <p className="text-muted-foreground">Metas mensais da equipe</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Meta</DialogTitle>
            </DialogHeader>
            <MetaForm form={form} onChange={setForm} colaboradores={colaboradores} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros de período */}
      <div className="flex gap-3 items-end">
        <div>
          <Label className="text-xs">Mês</Label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
          >
            {meses.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs">Ano</Label>
          <Input
            type="number"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {metas.map((m: any) => (
            <Card key={m.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{TIPO_LABELS[m.tipo] ?? m.tipo}</p>
                      {m.colaborador ? (
                        <Badge variant="outline">{m.colaborador.nome}</Badge>
                      ) : (
                        <Badge variant="secondary">Geral</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meses[m.mes - 1]} {m.ano}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg">{fmt(m.tipo, m.valor)}</p>
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {metas.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma meta para este período.
            </p>
          )}
        </div>
      )}

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            resetForm()
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
          </DialogHeader>
          <MetaForm form={form} onChange={setForm} colaboradores={colaboradores} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MetaForm({
  form,
  onChange,
  colaboradores,
}: {
  form: any
  onChange: (f: any) => void
  colaboradores: any[]
}) {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]

  return (
    <div className="space-y-3">
      <div>
        <Label>Tipo *</Label>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={form.tipo}
          onChange={(e) => onChange({ ...form, tipo: e.target.value })}
        >
          {Object.entries(TIPO_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Valor *</Label>
        <Input
          type="number"
          step="0.01"
          value={form.valor}
          onChange={(e) => onChange({ ...form, valor: e.target.value })}
          placeholder="0"
        />
      </div>
      <div>
        <Label>Colaborador (deixe vazio para meta geral)</Label>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={form.colaboradorId}
          onChange={(e) => onChange({ ...form, colaboradorId: e.target.value })}
        >
          <option value="">— Geral (toda equipe) —</option>
          {colaboradores.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Mês</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.mes}
            onChange={(e) => onChange({ ...form, mes: parseInt(e.target.value) })}
          >
            {meses.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Ano</Label>
          <Input
            type="number"
            value={form.ano}
            onChange={(e) => onChange({ ...form, ano: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
