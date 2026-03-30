"use client"

import { useState } from "react"
import { useVipCamPessoas, updatePessoa, deletePessoa, type VipCamPessoa } from "@/lib/vipcam/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Search, Pencil, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const TIPOS = ["", "cliente", "colaborador", "unknown"]
const PAGE_SIZE = 20

const tipoBadge: Record<string, string> = {
  cliente: "bg-blue-100 text-blue-700",
  colaborador: "bg-purple-100 text-purple-700",
  unknown: "bg-gray-100 text-gray-500",
}

function fmtDate(d: string | null) {
  if (!d) return "—"
  try { return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR }) } catch { return d }
}

function pctSat(v: number | null) {
  if (v === null) return "—"
  return `${(v * 100).toFixed(0)}%`
}

export default function PessoasPage() {
  const [busca, setBusca] = useState("")
  const [tipo, setTipo] = useState("")
  const [page, setPage] = useState(0)
  const [editingPessoa, setEditingPessoa] = useState<VipCamPessoa | null>(null)
  const [editForm, setEditForm] = useState({ nomeExibicao: "", tipoPessoa: "unknown" })
  const [saving, setSaving] = useState(false)

  const { data, loading, refetch } = useVipCamPessoas({
    busca: busca || undefined,
    tipo: tipo || undefined,
    take: PAGE_SIZE,
    skip: page * PAGE_SIZE,
  })

  const pessoas = data?.pessoas ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function openEdit(p: VipCamPessoa) {
    setEditingPessoa(p)
    setEditForm({ nomeExibicao: p.nomeExibicao ?? "", tipoPessoa: p.tipoPessoa })
  }

  async function handleSave() {
    if (!editingPessoa) return
    setSaving(true)
    try {
      await updatePessoa(editingPessoa.id, {
        nomeExibicao: editForm.nomeExibicao || null,
        tipoPessoa: editForm.tipoPessoa,
      })
      toast.success("Pessoa atualizada")
      setEditingPessoa(null)
      refetch()
    } catch {
      toast.error("Erro ao atualizar")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p: VipCamPessoa) {
    if (!confirm("Remover pessoa e todos seus dados?")) return
    try {
      await deletePessoa(p.id)
      toast.success("Pessoa removida")
      refetch()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <p className="text-muted-foreground">{total} pessoas identificadas</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPage(0) }}
          />
        </div>
        <Select value={tipo} onValueChange={(v) => { if (v !== undefined) { setTipo(v ?? ""); setPage(0) } }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="cliente">Clientes</SelectItem>
            <SelectItem value="colaborador">Colaboradores</SelectItem>
            <SelectItem value="unknown">Desconhecidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          ) : pessoas.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma pessoa encontrada</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Pessoa</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Visitas</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Satisfação</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Última vista</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{p.nomeExibicao ?? <span className="text-muted-foreground italic">Sem nome</span>}</p>
                        {p.idadeEstimada && (
                          <p className="text-xs text-muted-foreground">~{p.idadeEstimada} anos {p.generoEstimado ? `· ${p.generoEstimado}` : ""}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={tipoBadge[p.tipoPessoa] ?? "bg-gray-100 text-gray-500"}>
                        {p.tipoPessoa}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">{p.totalVisitas}</td>
                    <td className="px-4 py-3 text-right">{pctSat(p.avgSatisfacao)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(p.ultimaVista)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(p)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Página {page + 1} de {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editingPessoa} onOpenChange={(o) => { if (!o) setEditingPessoa(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pessoa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome de exibição</Label>
              <Input
                value={editForm.nomeExibicao}
                onChange={(e) => setEditForm({ ...editForm, nomeExibicao: e.target.value })}
                placeholder="Nome do cliente ou colaborador..."
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select
                value={editForm.tipoPessoa}
                onValueChange={(v) => { if (v) setEditForm({ ...editForm, tipoPessoa: v }) }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Desconhecido</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPessoa(null)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
