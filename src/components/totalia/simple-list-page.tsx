"use client"

import { useState } from "react"
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
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Field {
  key: string
  label: string
  type?: "text" | "textarea" | "date" | "select"
  required?: boolean
  options?: string[]
}

interface Props {
  title: string
  description: string
  icon: React.ReactNode
  items: any[]
  loading: boolean
  fields: Field[]
  displayFields: (item: any) => React.ReactNode
  onAdd: (data: any) => Promise<any>
  onUpdate: (id: string, data: any) => Promise<any>
  onDelete: (id: string) => Promise<void>
  itemToForm?: (item: any) => any
}

export function SimpleListPage({
  title,
  description,
  icon,
  items,
  loading,
  fields,
  displayFields,
  onAdd,
  onUpdate,
  onDelete,
  itemToForm,
}: Props) {
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const emptyForm = Object.fromEntries(fields.map((f) => [f.key, ""]))
  const [form, setForm] = useState<any>(emptyForm)

  const handleCreate = async () => {
    const required = fields.filter((f) => f.required)
    if (required.some((f) => !form[f.key])) {
      return toast.error(`Campo obrigatório: ${required.find((f) => !form[f.key])?.label}`)
    }
    try {
      await onAdd(form)
      setShowCreate(false)
      setForm(emptyForm)
    } catch {
      toast.error("Erro ao criar.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await onUpdate(editing.id, form)
      setEditing(null)
      setForm(emptyForm)
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Confirmar remoção?")) return
    try {
      await onDelete(id)
    } catch {
      toast.error("Erro ao remover.")
    }
  }

  const openEdit = (item: any) => {
    setForm(itemToForm ? itemToForm(item) : Object.fromEntries(fields.map((f) => [f.key, item[f.key] ?? ""])))
    setEditing(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo {title.replace(/s$/, "")}</DialogTitle>
            </DialogHeader>
            <FormFields fields={fields} form={form} onChange={setForm} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(emptyForm) }}>Cancelar</Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1">
                  {displayFields(item)}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum item cadastrado.</p>
          )}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) { setEditing(null); setForm(emptyForm) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar {title.replace(/s$/, "")}</DialogTitle>
          </DialogHeader>
          <FormFields fields={fields} form={form} onChange={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setForm(emptyForm) }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FormFields({ fields, form, onChange }: { fields: Field[]; form: any; onChange: (f: any) => void }) {
  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f.key}>
          <Label>{f.label}{f.required && " *"}</Label>
          {f.type === "textarea" ? (
            <textarea
              className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
              value={form[f.key] ?? ""}
              onChange={(e) => onChange({ ...form, [f.key]: e.target.value })}
            />
          ) : f.type === "select" ? (
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={form[f.key] ?? ""}
              onChange={(e) => onChange({ ...form, [f.key]: e.target.value })}
            >
              <option value="">— Selecione —</option>
              {f.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <Input
              type={f.type ?? "text"}
              value={form[f.key] ?? ""}
              onChange={(e) => onChange({ ...form, [f.key]: e.target.value })}
            />
          )}
        </div>
      ))}
    </div>
  )
}
