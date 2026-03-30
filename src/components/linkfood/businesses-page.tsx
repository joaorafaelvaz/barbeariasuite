"use client"

import { useState } from "react"
import { useBusinesses } from "@/lib/linkfood/hooks"
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
import { Plus, Edit, Trash2, Store, Star } from "lucide-react"

const emptyForm = {
  name: "",
  description: "",
  address: "",
  phone: "",
  website: "",
  category: "",
  googlePlaceId: "",
  isHeadquarters: false,
}

export default function BusinessesPage() {
  const { businesses, loading, createBusiness, updateBusiness, deleteBusiness } = useBusinesses()
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyForm)

  const resetForm = () => setForm(emptyForm)

  const handleCreate = async () => {
    if (!form.name) return toast.error("Nome é obrigatório.")
    try {
      await createBusiness(form)
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar estabelecimento.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateBusiness(editing.id, form)
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover estabelecimento e todas suas avaliações?")) return
    try {
      await deleteBusiness(id)
    } catch {
      toast.error("Erro ao remover.")
    }
  }

  const openEdit = (b: any) => {
    setForm({
      name: b.name,
      description: b.description ?? "",
      address: b.address ?? "",
      phone: b.phone ?? "",
      website: b.website ?? "",
      category: b.category ?? "",
      googlePlaceId: b.googlePlaceId ?? "",
      isHeadquarters: b.isHeadquarters,
    })
    setEditing(b)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estabelecimentos</h1>
          <p className="text-muted-foreground">Locais cadastrados para monitoramento</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Estabelecimento</DialogTitle>
            </DialogHeader>
            <BusinessForm form={form} onChange={setForm} />
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
        <div className="space-y-2">
          {businesses.map((b: any) => (
            <Card key={b.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{b.name}</p>
                      {b.isHeadquarters && <Badge>Sede</Badge>}
                      {b.category && <Badge variant="outline">{b.category}</Badge>}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                      {b.address && <span>{b.address}</span>}
                      {b.phone && <span>{b.phone}</span>}
                    </div>
                    {b.reviewSummary && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">
                          {b.reviewSummary.averageRating.toFixed(1)} (
                          {b.reviewSummary.totalReviews} avaliações)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(b)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {businesses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum estabelecimento cadastrado.
            </p>
          )}
        </div>
      )}

      <Dialog
        open={!!editing}
        onOpenChange={(open) => { if (!open) { setEditing(null); resetForm() } }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estabelecimento</DialogTitle>
          </DialogHeader>
          <BusinessForm form={form} onChange={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); resetForm() }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BusinessForm({ form, onChange }: { form: any; onChange: (f: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Nome *</Label>
        <Input
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="Nome do estabelecimento"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Categoria</Label>
          <Input
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            placeholder="Ex: Restaurante, Bar..."
          />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Endereço</Label>
        <Input
          value={form.address}
          onChange={(e) => onChange({ ...form, address: e.target.value })}
        />
      </div>
      <div>
        <Label>Website</Label>
        <Input
          value={form.website}
          onChange={(e) => onChange({ ...form, website: e.target.value })}
          placeholder="https://"
        />
      </div>
      <div>
        <Label>Google Place ID</Label>
        <Input
          value={form.googlePlaceId}
          onChange={(e) => onChange({ ...form, googlePlaceId: e.target.value })}
          placeholder="ChIJ..."
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[60px] resize-none"
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hq"
          checked={form.isHeadquarters}
          onChange={(e) => onChange({ ...form, isHeadquarters: e.target.checked })}
        />
        <Label htmlFor="hq">É a sede principal</Label>
      </div>
    </div>
  )
}
