"use client"

import { useState } from "react"
import { useFetch } from "@/lib/totalia/use-fetch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Building2, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Unit {
  id: string
  name: string
  slug: string
  networkId: string
  erpId: number | null
  network: { id: string; name: string }
  createdAt: string
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function UnitsPage() {
  const { data, loading, refetch } = useFetch<Unit[]>("/api/units")
  const units = data ?? []

  const [showCreate, setShowCreate] = useState(false)
  const [editUnit, setEditUnit] = useState<Unit | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [form, setForm] = useState({ name: "", slug: "", erpId: "" })

  function openCreate() {
    setForm({ name: "", slug: "", erpId: "" })
    setShowCreate(true)
  }

  function openEdit(unit: Unit) {
    setForm({ name: unit.name, slug: unit.slug, erpId: unit.erpId?.toString() ?? "" })
    setEditUnit(unit)
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugify(name) }))
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      toast.error("Preencha nome e slug")
      return
    }
    setSaving(true)
    const payload = {
      name: form.name,
      slug: form.slug,
      erpId: form.erpId ? parseInt(form.erpId, 10) : null,
    }
    try {
      if (editUnit) {
        const res = await fetch(`/api/units/${editUnit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Erro ao atualizar")
        toast.success("Unidade atualizada")
        setEditUnit(null)
      } else {
        const res = await fetch("/api/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Erro ao criar")
        toast.success("Unidade criada")
        setShowCreate(false)
      }
      refetch()
    } catch {
      toast.error("Ocorreu um erro")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta unidade?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao excluir")
      toast.success("Unidade excluída")
      refetch()
    } catch {
      toast.error("Ocorreu um erro")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Unidades</h1>
          <p className="text-muted-foreground">
            Gerencie as unidades da sua rede
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Unidade
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </div>
      ) : units.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium">Nenhuma unidade cadastrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie a primeira unidade da sua rede
            </p>
            <Button className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Unidade
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit: Unit) => (
            <Card key={unit.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{unit.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(unit)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(unit.id)}
                      disabled={deleting === unit.id}
                    >
                      {deleting === unit.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription className="font-mono text-xs">
                  /{unit.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Rede: {unit.network?.name ?? "—"}
                </p>
                {unit.erpId && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ERP ID: <span className="font-mono">{unit.erpId}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Criada em{" "}
                  {new Date(unit.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog criar / editar */}
      <Dialog
        open={showCreate || !!editUnit}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreate(false)
            setEditUnit(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editUnit ? "Editar Unidade" : "Nova Unidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Barbearia Centro"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (identificador único)</Label>
              <Input
                id="slug"
                placeholder="Ex: barbearia-centro"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Gerado automaticamente, pode editar manualmente
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="erpId">ID do ERP</Label>
              <Input
                id="erpId"
                type="number"
                placeholder="Ex: 12 (unidades.id no banco franquia_producao)"
                value={form.erpId}
                onChange={(e) => setForm((f) => ({ ...f, erpId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Necessário para sincronização com o ERP. Consulte a tabela{" "}
                <code className="bg-muted px-1 rounded">unidades</code> no banco de dados.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreate(false)
                setEditUnit(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editUnit ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
