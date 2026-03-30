"use client"

import { useState } from "react"
import { useVipDataServicos, createServico, updateServico, deleteServico, type VipDataServico } from "@/lib/vip-data/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

type Form = { nome: string; categoria: string; preco: string; duracao: string; ativo: boolean }

const empty: Form = { nome: "", categoria: "", preco: "", duracao: "", ativo: true }

export default function ServicosPage() {
  const { data: servicosData, loading, refetch } = useVipDataServicos()
  const servicos = servicosData ?? []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VipDataServico | null>(null)
  const [form, setForm] = useState<Form>(empty)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)

  const filtered = servicos.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    (s.categoria ?? "").toLowerCase().includes(search.toLowerCase())
  )

  function openNew() {
    setEditing(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(s: VipDataServico) {
    setEditing(s)
    setForm({
      nome: s.nome,
      categoria: s.categoria ?? "",
      preco: String(s.preco),
      duracao: s.duracao ? String(s.duracao) : "",
      ativo: s.ativo,
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.nome.trim()) { toast.error("Nome obrigatório"); return }
    setSaving(true)
    try {
      const payload = {
        nome: form.nome.trim(),
        categoria: form.categoria.trim() || null,
        preco: parseFloat(form.preco) || 0,
        duracao: form.duracao ? parseInt(form.duracao) : null,
        ativo: form.ativo,
      }
      if (editing) {
        await updateServico(editing.id, payload)
        toast.success("Serviço atualizado")
      } else {
        await createServico(payload)
        toast.success("Serviço criado")
      }
      setOpen(false)
      refetch()
    } catch {
      toast.error("Erro ao salvar serviço")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(s: VipDataServico) {
    if (!confirm(`Remover "${s.nome}"?`)) return
    try {
      await deleteServico(s.id)
      toast.success("Serviço removido")
      refetch()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-muted-foreground">Catálogo de serviços da unidade</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-muted-foreground text-center">Nenhum serviço encontrado</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Serviço</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Categoria</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Preço</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Duração</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{s.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.categoria ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{fmt(s.preco)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {s.duracao ? `${s.duracao} min` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={s.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                        {s.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(s)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Corte de cabelo"
              />
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Input
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                placeholder="Ex: Cabelo, Barba..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.duracao}
                  onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                  placeholder="Ex: 30"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
