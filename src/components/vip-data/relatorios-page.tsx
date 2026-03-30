"use client"

import { useState } from "react"
import {
  useVipDataRelatorios, createRelatorio, deleteRelatorio, type VipDataRelatorio,
} from "@/lib/vip-data/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Trash2, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PAGE_SIZE = 10

export default function RelatoriosPage() {
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [viewing, setViewing] = useState<VipDataRelatorio | null>(null)

  const { data, loading, refetch } = useVipDataRelatorios({ take: PAGE_SIZE, skip: page * PAGE_SIZE })
  const relatorios = data?.relatorios ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const [form, setForm] = useState({
    titulo: "",
    semanaInicio: "",
    semanaFim: "",
    observacoes: "",
  })

  function fmtDate(d: string) {
    try { return format(new Date(d), "dd/MM/yyyy", { locale: ptBR }) } catch { return d }
  }

  async function handleSave() {
    if (!form.semanaInicio || !form.semanaFim) {
      toast.error("Informe o período da semana")
      return
    }
    setSaving(true)
    try {
      await createRelatorio({
        titulo: form.titulo || `Semana ${fmtDate(form.semanaInicio)} – ${fmtDate(form.semanaFim)}`,
        semanaInicio: form.semanaInicio,
        semanaFim: form.semanaFim,
        conteudo: { observacoes: form.observacoes },
      })
      toast.success("Relatório criado")
      setOpen(false)
      setForm({ titulo: "", semanaInicio: "", semanaFim: "", observacoes: "" })
      refetch()
    } catch {
      toast.error("Erro ao criar relatório")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(r: VipDataRelatorio) {
    if (!confirm("Remover relatório?")) return
    try {
      await deleteRelatorio(r.id)
      toast.success("Relatório removido")
      refetch()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Semanais</h1>
          <p className="text-muted-foreground">{total} relatório{total !== 1 ? "s" : ""} registrado{total !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          ) : relatorios.length === 0 ? (
            <p className="p-6 text-muted-foreground text-center">Nenhum relatório encontrado</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Período</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Título</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Criado em</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {relatorios.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground">
                      {fmtDate(r.semanaInicio)} – {fmtDate(r.semanaFim)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <button
                        className="text-left hover:underline"
                        onClick={() => setViewing(r)}
                      >
                        {r.titulo ?? "Sem título"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewing(r)}>
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(r)}>
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
          <p className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </p>
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

      {/* Novo Relatório */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Relatório Semanal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Início da Semana *</Label>
                <Input type="date" value={form.semanaInicio} onChange={(e) => setForm({ ...form, semanaInicio: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Fim da Semana *</Label>
                <Input type="date" value={form.semanaFim} onChange={(e) => setForm({ ...form, semanaFim: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Título (opcional)</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título do relatório..." />
            </div>
            <div className="space-y-1">
              <Label>Observações</Label>
              <Textarea
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Adicione observações sobre a semana..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visualizar relatório */}
      <Dialog open={!!viewing} onOpenChange={(o) => { if (!o) setViewing(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.titulo ?? "Relatório"}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 py-2 text-sm">
              <p className="text-muted-foreground">
                {fmtDate(viewing.semanaInicio)} – {fmtDate(viewing.semanaFim)}
              </p>
              {viewing.conteudo && (viewing.conteudo as { observacoes?: string }).observacoes && (
                <div className="rounded-md border p-3 whitespace-pre-wrap text-muted-foreground">
                  {(viewing.conteudo as { observacoes: string }).observacoes}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewing(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
