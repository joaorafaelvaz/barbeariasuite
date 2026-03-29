"use client"

import { useState } from "react"
import { useColaboradores, useCargos } from "@/lib/totalia/hooks"
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
import { Plus, Users, Mail, Phone, Briefcase, Edit, Trash2 } from "lucide-react"

export default function ColaboradoresPage() {
  const { colaboradores, loading, addColaborador, updateColaborador, deleteColaborador } = useColaboradores()
  const { cargos } = useCargos()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cargo: "", area: "" })

  const resetForm = () => setForm({ nome: "", email: "", telefone: "", cargo: "", area: "" })

  const handleCreate = async () => {
    if (!form.nome) return toast.error("Nome é obrigatório.")
    try {
      await addColaborador(form)
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
    setForm({ nome: c.nome, email: c.email ?? "", telefone: c.telefone ?? "", cargo: c.cargo ?? "", area: c.area ?? "" })
    setEditing(c)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground">Gestão da equipe</p>
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
            <ColaboradorForm form={form} onChange={setForm} cargos={cargos} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetForm() }}>Cancelar</Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colaboradores.map((c: any) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  {c.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                {c.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {c.email}
                  </div>
                )}
                {c.telefone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {c.telefone}
                  </div>
                )}
                {c.cargo && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {c.cargo}
                  </div>
                )}
                {c.area && <Badge variant="outline">{c.area}</Badge>}
                <div className="flex gap-2 pt-2">
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
            <p className="col-span-full text-center text-muted-foreground py-8">
              Nenhum colaborador cadastrado.
            </p>
          )}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) { setEditing(null); resetForm() } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
          </DialogHeader>
          <ColaboradorForm form={form} onChange={setForm} cargos={cargos} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); resetForm() }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ColaboradorForm({ form, onChange, cargos }: { form: any; onChange: (f: any) => void; cargos: any[] }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Nome *</Label>
        <Input value={form.nome} onChange={(e) => onChange({ ...form, nome: e.target.value })} placeholder="Nome completo" />
      </div>
      <div>
        <Label>E-mail</Label>
        <Input value={form.email} onChange={(e) => onChange({ ...form, email: e.target.value })} type="email" placeholder="email@empresa.com" />
      </div>
      <div>
        <Label>Telefone</Label>
        <Input value={form.telefone} onChange={(e) => onChange({ ...form, telefone: e.target.value })} placeholder="(48) 9 0000-0000" />
      </div>
      <div>
        <Label>Cargo</Label>
        <Input value={form.cargo} onChange={(e) => onChange({ ...form, cargo: e.target.value })} placeholder="Cargo ou função" list="cargos-list" />
        <datalist id="cargos-list">
          {cargos.map((c: any) => <option key={c.id} value={c.nome} />)}
        </datalist>
      </div>
      <div>
        <Label>Área</Label>
        <Input value={form.area} onChange={(e) => onChange({ ...form, area: e.target.value })} placeholder="Departamento ou área" />
      </div>
    </div>
  )
}
