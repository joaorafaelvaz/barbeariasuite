"use client"

import { useState } from "react"
import { useClientesBarbershop } from "@/lib/barbershop/hooks"
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
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_COLORS: Record<string, any> = {
  ativo: "default",
  em_risco: "secondary",
  perdido: "destructive",
  novo: "outline",
}

const STATUS_LABELS: Record<string, string> = {
  ativo: "Ativo",
  em_risco: "Em Risco",
  perdido: "Perdido",
  novo: "Novo",
}

const emptyForm = {
  nome: "",
  telefone: "",
  email: "",
  bairro: "",
  cidade: "",
  estado: "",
  nascimento: "",
  statusCliente: "ativo",
}

export default function ClientesPageBarbershop() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const { clientes, loading, createCliente, updateCliente, deleteCliente } =
    useClientesBarbershop({ q: search || undefined, status: filterStatus || undefined })

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)

  const resetForm = () => setForm(emptyForm)

  const handleCreate = async () => {
    if (!form.nome) return toast.error("Nome é obrigatório.")
    try {
      await createCliente({
        ...form,
        nascimento: form.nascimento ? new Date(form.nascimento) : null,
      })
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar cliente.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateCliente(editing.id, {
        ...form,
        nascimento: form.nascimento ? new Date(form.nascimento) : null,
      })
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar cliente.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover cliente?")) return
    try {
      await deleteCliente(id)
    } catch {
      toast.error("Erro ao remover cliente.")
    }
  }

  const openEdit = (c: any) => {
    setForm({
      nome: c.nome,
      telefone: c.telefone ?? "",
      email: c.email ?? "",
      bairro: c.bairro ?? "",
      cidade: c.cidade ?? "",
      estado: c.estado ?? "",
      nascimento: c.nascimento ? c.nascimento.split("T")[0] : "",
      statusCliente: c.statusCliente ?? "ativo",
    })
    setEditing(c)
  }

  const statuses = [
    { value: "", label: `Todos (${clientes.length})` },
    { value: "ativo", label: "Ativos" },
    { value: "em_risco", label: "Em Risco" },
    { value: "perdido", label: "Perdidos" },
    { value: "novo", label: "Novos" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Base de clientes da barbearia</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClienteForm form={form} onChange={setForm} />
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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={filterStatus === s.value ? "default" : "outline"}
              onClick={() => setFilterStatus(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {clientes.map((c: any) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{c.nome}</p>
                    {c.statusCliente && (
                      <Badge variant={STATUS_COLORS[c.statusCliente] ?? "secondary"}>
                        {STATUS_LABELS[c.statusCliente] ?? c.statusCliente}
                      </Badge>
                    )}
                    {c.pontuacao !== null && c.pontuacao !== undefined && (
                      <Badge variant="outline">{c.pontuacao} pts</Badge>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                    {c.telefone && <span>{c.telefone}</span>}
                    {c.cidade && <span>{c.cidade}</span>}
                    {c.ultimaVisita && (
                      <span>
                        Última visita:{" "}
                        {format(new Date(c.ultimaVisita), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {c.consumoTotal != null && (
                      <span>
                        Total:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(c.consumoTotal)}
                      </span>
                    )}
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
          {clientes.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente encontrado.</p>
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
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm form={form} onChange={setForm} />
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

function ClienteForm({ form, onChange }: { form: any; onChange: (f: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Nome *</Label>
        <Input
          value={form.nome}
          onChange={(e) => onChange({ ...form, nome: e.target.value })}
          placeholder="Nome do cliente"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
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
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Cidade</Label>
          <Input
            value={form.cidade}
            onChange={(e) => onChange({ ...form, cidade: e.target.value })}
          />
        </div>
        <div>
          <Label>Estado</Label>
          <Input
            value={form.estado}
            onChange={(e) => onChange({ ...form, estado: e.target.value })}
            placeholder="SP"
            maxLength={2}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Nascimento</Label>
          <Input
            type="date"
            value={form.nascimento}
            onChange={(e) => onChange({ ...form, nascimento: e.target.value })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.statusCliente}
            onChange={(e) => onChange({ ...form, statusCliente: e.target.value })}
          >
            {["ativo", "em_risco", "perdido", "novo"].map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
