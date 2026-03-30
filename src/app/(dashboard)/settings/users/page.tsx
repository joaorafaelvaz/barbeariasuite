"use client"

import { useState } from "react"
import { useFetch } from "@/lib/totalia/use-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Users, Pencil, Trash2, Plus, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

const ROLES: { value: string; label: string; color: string }[] = [
  { value: "SUPER_ADMIN",    label: "Super Admin",    color: "bg-red-100 text-red-700" },
  { value: "FRANQUEADOR",    label: "Franqueador",    color: "bg-purple-100 text-purple-700" },
  { value: "MULTIFRANQUEADO",label: "Multifranqueado",color: "bg-blue-100 text-blue-700" },
  { value: "GERENTE",        label: "Gerente",        color: "bg-orange-100 text-orange-700" },
  { value: "COLABORADOR",    label: "Colaborador",    color: "bg-gray-100 text-gray-700" },
]

function roleBadge(role: string) {
  return ROLES.find((r) => r.value === role) ?? { label: role, color: "bg-gray-100 text-gray-700" }
}

export default function UsersPage() {
  const { data, loading, refetch } = useFetch<User[]>("/api/settings/users")
  const users = data ?? []

  const [editUser, setEditUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  const [form, setForm] = useState({ name: "", role: "COLABORADOR" })
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "", role: "COLABORADOR" })
  const [inviting, setInviting] = useState(false)

  function openEdit(user: User) {
    setForm({ name: user.name, role: user.role })
    setEditUser(user)
  }

  async function handleSave() {
    if (!editUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/settings/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Usuário atualizado")
      setEditUser(null)
      refetch()
    } catch {
      toast.error("Ocorreu um erro")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este usuário?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/settings/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir")
      toast.success("Usuário excluído")
      refetch()
    } catch {
      toast.error("Ocorreu um erro")
    } finally {
      setDeleting(null)
    }
  }

  async function handleInvite() {
    if (!inviteForm.name || !inviteForm.email || !inviteForm.password) {
      toast.error("Preencha todos os campos")
      return
    }
    setInviting(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? "Erro ao criar usuário")
      }
      toast.success("Usuário criado com sucesso")
      setShowInvite(false)
      setInviteForm({ name: "", email: "", password: "", role: "COLABORADOR" })
      refetch()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro")
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">Nenhum usuário encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {users.length} usuário{users.length !== 1 ? "s" : ""}
            </CardTitle>
            <CardDescription>Clique no ícone para editar perfil ou função</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Nome</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Função</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Criado em</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => {
                  const rb = roleBadge(user.role)
                  return (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={rb.color}>{rb.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(user)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user.id)}
                            disabled={deleting === user.id}
                          >
                            {deleting === user.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Dialog editar */}
      <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) setEditUser(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Usuário</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select value={form.role} onValueChange={(v) => { if (v) setForm((f) => ({ ...f, role: v })) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog novo usuário */}
      <Dialog open={showInvite} onOpenChange={(o) => { if (!o) setShowInvite(false) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Usuário</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input
                placeholder="João Silva"
                value={inviteForm.name}
                onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="joao@exemplo.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha provisória</Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={inviteForm.password}
                onChange={(e) => setInviteForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select
                value={inviteForm.role}
                onValueChange={(v) => { if (v) setInviteForm((f) => ({ ...f, role: v })) }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancelar</Button>
            <Button onClick={handleInvite} disabled={inviting}>
              {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
