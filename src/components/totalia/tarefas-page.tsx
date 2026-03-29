"use client"

import { useState } from "react"
import { useTasks, useColaboradores } from "@/lib/totalia/hooks"
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
import { Plus, CheckSquare, User, Calendar, Clock, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_COLORS: Record<string, string> = {
  "A Fazer": "secondary",
  "Em Andamento": "default",
  "Concluída": "outline",
  "Pausada": "outline",
  "Cancelada": "destructive",
}

const PRIORIDADE_COLORS: Record<string, string> = {
  Alta: "destructive",
  Média: "default",
  Baixa: "secondary",
}

export default function TarefasPage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const { colaboradores } = useColaboradores()

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [form, setForm] = useState<any>({
    titulo: "",
    descricao: "",
    area: "",
    prioridade: "Média",
    status: "A Fazer",
    due_date: "",
    responsavel_id: "",
  })

  const resetForm = () => setForm({ titulo: "", descricao: "", area: "", prioridade: "Média", status: "A Fazer", due_date: "", responsavel_id: "" })

  const filtered = filterStatus === "todos"
    ? tasks
    : tasks.filter((t: any) => t.status === filterStatus)

  const handleCreate = async () => {
    if (!form.titulo) return toast.error("Título é obrigatório.")
    try {
      await createTask(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar tarefa.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateTask(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar tarefa.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover tarefa?")) return
    try {
      await deleteTask(id)
    } catch {
      toast.error("Erro ao remover tarefa.")
    }
  }

  const openEdit = (t: any) => {
    setForm({
      titulo: t.titulo,
      descricao: t.descricao ?? "",
      area: t.area ?? "",
      prioridade: t.prioridade ?? "Média",
      status: t.status,
      due_date: t.dueDate ? t.dueDate.split("T")[0] : "",
      responsavel_id: t.responsavelId ?? "",
    })
    setEditing(t)
  }

  const statuses = ["todos", "A Fazer", "Em Andamento", "Concluída", "Pausada", "Cancelada"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground">Gestão de tarefas e entregas</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <TaskForm form={form} onChange={setForm} colaboradores={colaboradores} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetForm() }}>Cancelar</Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={filterStatus === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(s)}
          >
            {s === "todos" ? "Todos" : s}
            {s !== "todos" && (
              <span className="ml-1 text-xs opacity-70">
                ({tasks.filter((t: any) => t.status === s).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((t: any) => (
            <Card key={t.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{t.titulo}</p>
                    <Badge variant={(STATUS_COLORS[t.status] ?? "secondary") as any}>{t.status}</Badge>
                    {t.prioridade && (
                      <Badge variant={(PRIORIDADE_COLORS[t.prioridade] ?? "secondary") as any}>
                        {t.prioridade}
                      </Badge>
                    )}
                  </div>
                  {t.descricao && <p className="text-sm text-muted-foreground line-clamp-2">{t.descricao}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {t.responsavel && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {t.responsavel.nome}
                      </span>
                    )}
                    {t.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(t.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {t.estimativaHoras && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t.estimativaHoras}h
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhuma tarefa encontrada.</p>
          )}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) { setEditing(null); resetForm() } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
          </DialogHeader>
          <TaskForm form={form} onChange={setForm} colaboradores={colaboradores} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); resetForm() }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskForm({ form, onChange, colaboradores }: { form: any; onChange: (f: any) => void; colaboradores: any[] }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Título *</Label>
        <Input value={form.titulo} onChange={(e) => onChange({ ...form, titulo: e.target.value })} placeholder="Título da tarefa" />
      </div>
      <div>
        <Label>Descrição</Label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
          value={form.descricao}
          onChange={(e) => onChange({ ...form, descricao: e.target.value })}
          placeholder="Descreva a tarefa..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Status</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) => onChange({ ...form, status: e.target.value })}
          >
            {["A Fazer", "Em Andamento", "Concluída", "Pausada", "Cancelada"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Prioridade</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.prioridade}
            onChange={(e) => onChange({ ...form, prioridade: e.target.value })}
          >
            {["Alta", "Média", "Baixa"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Responsável</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.responsavel_id}
            onChange={(e) => onChange({ ...form, responsavel_id: e.target.value })}
          >
            <option value="">— Nenhum —</option>
            {colaboradores.map((c: any) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Data Limite</Label>
          <Input
            type="date"
            value={form.due_date}
            onChange={(e) => onChange({ ...form, due_date: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
