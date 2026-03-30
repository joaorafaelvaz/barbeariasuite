"use client"

import { useState } from "react"
import { useChecklists } from "@/lib/linkfood/hooks"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2, CheckSquare, Check } from "lucide-react"

const FREQ_LABELS: Record<string, string> = {
  DAILY: "Diário",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
}

export default function ChecklistsPage() {
  const { checklists, loading, createChecklist, updateChecklist, deleteChecklist, completeItems } =
    useChecklists()
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [completing, setCompleting] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    frequency: "DAILY",
    isActive: true,
    items: [] as { title: string }[],
  })

  const resetForm = () =>
    setForm({ title: "", description: "", frequency: "DAILY", isActive: true, items: [] })

  const handleCreate = async () => {
    if (!form.title) return toast.error("Título é obrigatório.")
    try {
      await createChecklist(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar checklist.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateChecklist(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar checklist.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover checklist?")) return
    try {
      await deleteChecklist(id)
    } catch {
      toast.error("Erro ao remover checklist.")
    }
  }

  const openEdit = (c: any) => {
    setForm({
      title: c.title,
      description: c.description ?? "",
      frequency: c.frequency,
      isActive: c.isActive,
      items: c.items?.map((i: any) => ({ title: i.title })) ?? [],
    })
    setEditing(c)
  }

  const openComplete = (c: any) => {
    setCheckedItems(new Set())
    setCompleting(c)
  }

  const handleComplete = async () => {
    if (!completing) return
    const itemIds = completing.items
      .filter((i: any) => checkedItems.has(i.id))
      .map((i: any) => i.id)
    await completeItems(completing.id, itemIds, new Date().toISOString().split("T")[0])
    setCompleting(null)
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { title: "" }] })
  const removeItem = (i: number) =>
    setForm({ ...form, items: form.items.filter((_: any, idx: number) => idx !== i) })
  const updateItem = (i: number, title: string) =>
    setForm({
      ...form,
      items: form.items.map((item: any, idx: number) => (idx === i ? { title } : item)),
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Checklists</h1>
          <p className="text-muted-foreground">Tarefas operacionais recorrentes</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Checklist
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Checklist</DialogTitle>
            </DialogHeader>
            <ChecklistForm form={form} onChange={setForm} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetForm() }}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {checklists.map((c: any) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    {c.title}
                    <Badge variant="outline">{FREQ_LABELS[c.frequency] ?? c.frequency}</Badge>
                    {!c.isActive && <Badge variant="secondary">Inativo</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" onClick={() => openComplete(c)}>
                      <Check className="h-3 w-3 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {c.items?.length > 0 && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {c.items.map((item: any) => (
                      <span key={item.id} className="text-xs bg-muted rounded px-2 py-0.5">
                        {item.title}
                      </span>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          {checklists.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum checklist cadastrado.</p>
          )}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => { if (!open) { setEditing(null); resetForm() } }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Checklist</DialogTitle>
          </DialogHeader>
          <ChecklistForm form={form} onChange={setForm} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); resetForm() }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete dialog */}
      <Dialog open={!!completing} onOpenChange={(open) => { if (!open) setCompleting(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Executar: {completing?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {completing?.items?.map((item: any) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={(e) => {
                    const s = new Set(checkedItems)
                    e.target.checked ? s.add(item.id) : s.delete(item.id)
                    setCheckedItems(s)
                  }}
                />
                <span className="text-sm">{item.title}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancelar</Button>
            <Button onClick={handleComplete} disabled={checkedItems.size === 0}>
              Confirmar ({checkedItems.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ChecklistForm({
  form,
  onChange,
  addItem,
  removeItem,
  updateItem,
}: {
  form: any
  onChange: (f: any) => void
  addItem: () => void
  removeItem: (i: number) => void
  updateItem: (i: number, title: string) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Título *</Label>
        <Input
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Frequência</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.frequency}
            onChange={(e) => onChange({ ...form, frequency: e.target.value })}
          >
            {Object.entries(FREQ_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.isActive ? "ativo" : "inativo"}
            onChange={(e) => onChange({ ...form, isActive: e.target.value === "ativo" })}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Input
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Itens</Label>
          <Button type="button" size="sm" variant="outline" onClick={addItem}>
            <Plus className="h-3 w-3 mr-1" />
            Item
          </Button>
        </div>
        {form.items.map((item: any, i: number) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item.title}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
