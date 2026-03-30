"use client"

import { useState } from "react"
import { useComissoesBarbershop, useColaboradoresBarbershop } from "@/lib/barbershop/hooks"
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
import { Plus, Edit, Trash2, Percent } from "lucide-react"

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

function emptyRegra(mes: number, ano: number) {
  return {
    tipo: "geral",
    colaboradorId: "",
    percentualFixo: "",
    usaEscalonamento: false,
    mes,
    ano,
    faixas: [] as any[],
  }
}

export default function ComissoesPageBarbershop() {
  const now = new Date()
  const [ano, setAno] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)

  const { comissoes, loading, createComissao, updateComissao, deleteComissao } =
    useComissoesBarbershop(mes, ano)
  const { colaboradores } = useColaboradoresBarbershop()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyRegra(mes, ano))

  const resetForm = () => setForm(emptyRegra(mes, ano))

  const handleCreate = async () => {
    try {
      await createComissao(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar regra.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateComissao(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar regra.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover regra de comissão?")) return
    try {
      await deleteComissao(id)
    } catch {
      toast.error("Erro ao remover regra.")
    }
  }

  const openEdit = (r: any) => {
    setForm({
      tipo: r.tipo,
      colaboradorId: r.colaboradorId ?? "",
      percentualFixo: r.percentualFixo != null ? String(r.percentualFixo) : "",
      usaEscalonamento: r.usaEscalonamento,
      mes: r.mes,
      ano: r.ano,
      faixas: r.faixas ?? [],
    })
    setEditing(r)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comissões</h1>
          <p className="text-muted-foreground">Regras de comissão por período</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Regra
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nova Regra de Comissão</DialogTitle>
            </DialogHeader>
            <ComissaoForm form={form} onChange={setForm} colaboradores={colaboradores} />
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

      {/* Filtros */}
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
          {comissoes.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-4 py-3">
                <div className="flex items-start gap-3">
                  <Percent className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {r.tipo === "geral" ? "Regra Geral" : "Regra Individual"}
                      </p>
                      {r.colaborador && <Badge variant="outline">{r.colaborador.nome}</Badge>}
                      {r.usaEscalonamento ? (
                        <Badge>Escalonado</Badge>
                      ) : (
                        <Badge variant="secondary">{r.percentualFixo}%</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {meses[r.mes - 1]} {r.ano}
                    </p>
                    {r.faixas?.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-1">
                        {r.faixas.map((f: any) => (
                          <span
                            key={f.id}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: f.cor ?? "#e5e7eb", color: "#111" }}
                          >
                            {f.nome}: {f.percentual}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(r)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {comissoes.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma regra para este período.
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Regra de Comissão</DialogTitle>
          </DialogHeader>
          <ComissaoForm form={form} onChange={setForm} colaboradores={colaboradores} />
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

function ComissaoForm({
  form,
  onChange,
  colaboradores,
}: {
  form: any
  onChange: (f: any) => void
  colaboradores: any[]
}) {
  const addFaixa = () =>
    onChange({ ...form, faixas: [...form.faixas, { nome: "", percentual: "", cor: "" }] })
  const removeFaixa = (i: number) =>
    onChange({ ...form, faixas: form.faixas.filter((_: any, idx: number) => idx !== i) })
  const updateFaixa = (i: number, key: string, value: string) => {
    const faixas = form.faixas.map((f: any, idx: number) =>
      idx === i ? { ...f, [key]: value } : f
    )
    onChange({ ...form, faixas })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tipo</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.tipo}
            onChange={(e) => onChange({ ...form, tipo: e.target.value })}
          >
            <option value="geral">Geral</option>
            <option value="individual">Individual</option>
          </select>
        </div>
        <div>
          <Label>Colaborador</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.colaboradorId}
            onChange={(e) => onChange({ ...form, colaboradorId: e.target.value })}
          >
            <option value="">— Todos —</option>
            {colaboradores.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
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
      <div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="escalonamento"
            checked={form.usaEscalonamento}
            onChange={(e) => onChange({ ...form, usaEscalonamento: e.target.checked })}
          />
          <Label htmlFor="escalonamento">Usa escalonamento por faixas</Label>
        </div>
      </div>
      {!form.usaEscalonamento ? (
        <div>
          <Label>Percentual Fixo (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={form.percentualFixo}
            onChange={(e) => onChange({ ...form, percentualFixo: e.target.value })}
            placeholder="Ex: 30"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Faixas</Label>
            <Button type="button" size="sm" variant="outline" onClick={addFaixa}>
              <Plus className="h-3 w-3 mr-1" />
              Faixa
            </Button>
          </div>
          {form.faixas.map((f: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="Nome"
                value={f.nome}
                onChange={(e) => updateFaixa(i, "nome", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="%"
                value={f.percentual}
                onChange={(e) => updateFaixa(i, "percentual", e.target.value)}
                className="w-20"
              />
              <Input
                type="color"
                value={f.cor || "#3b82f6"}
                onChange={(e) => updateFaixa(i, "cor", e.target.value)}
                className="w-12 px-1"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeFaixa(i)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
