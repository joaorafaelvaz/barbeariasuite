"use client"

import { useState } from "react"
import { useColaboradoresBarbershop } from "@/lib/barbershop/hooks"
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
import { Plus, Edit, Trash2, User } from "lucide-react"

const emptyForm = { nome: "", tipo: "", telefone: "", email: "", ativo: true }

export default function ColaboradoresPageBarbershop() {
  const { colaboradores, loading, createColaborador, updateColaborador, deleteColaborador } =
    useColaboradoresBarbershop()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)

  const resetForm = () => setForm(emptyForm)

  const handleCreate = async () => {
    if (!form.nome) return toast.error("Nome é obrigatório.")
    try {
      await createColaborador(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar colaborador.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateColaborador(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar colaborador.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover colaborador?")) return
    try {
      await deleteColaborador(id)
    } catch {
      toast.error("Erro ao remover colaborador.")
    }
  }

  const openEdit = (c: any) => {
    setForm({
      nome: c.nome,
      tipo: c.tipo ?? "",
      telefone: c.telefone ?? "",
      email: c.email ?? "",
      ativo: c.ativo,
    })
    setEditing(c)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground">Barbeiros e equipe</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Colaborador
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Colaborador</DialogTitle>
            </DialogHeader>
            <ColaboradorForm form={form} onChange={setForm} />
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

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {colaboradores.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{c.nome}</p>
                      {c.tipo && (
                        <Badge variant="outline" className="text-xs">
                          {c.tipo}
                        </Badge>
                      )}
                      {!c.ativo && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {c.telefone && <span>{c.telefone}</span>}
                      {c.email && <span>{c.email}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {colaboradores.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum colaborador cadastrado.
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
            <DialogTitle>Editar Colaborador</DialogTitle>
          </DialogHeader>
          <ColaboradorForm form={form} onChange={setForm} />
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

function ColaboradorForm({ form, onChange }: { form: any; onChange: (f: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Nome *</Label>
        <Input
          value={form.nome}
          onChange={(e) => onChange({ ...form, nome: e.target.value })}
          placeholder="Nome do colaborador"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Tipo</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.tipo}
            onChange={(e) => onChange({ ...form, tipo: e.target.value })}
          >
            <option value="">— Selecione —</option>
            {["Barbeiro", "Atendente", "Gerente", "Estagiário"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.ativo ? "ativo" : "inativo"}
            onChange={(e) => onChange({ ...form, ativo: e.target.value === "ativo" })}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Telefone</Label>
        <Input
          value={form.telefone}
          onChange={(e) => onChange({ ...form, telefone: e.target.value })}
          placeholder="(00) 00000-0000"
        />
      </div>
      <div>
        <Label>E-mail</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => onChange({ ...form, email: e.target.value })}
          placeholder="email@exemplo.com"
        />
      </div>
    </div>
  )
}
