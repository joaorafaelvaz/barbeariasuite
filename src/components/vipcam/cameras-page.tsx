"use client"

import { useState } from "react"
import { useVipCamCameras, createCamera, updateCamera, deleteCamera, type VipCamCamera } from "@/lib/vipcam/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Camera, Wifi, WifiOff } from "lucide-react"

type Form = {
  nome: string
  localizacao: string
  rtspUrl: string
  isActive: boolean
  resolucao: string
  fpsTarget: string
}

const empty: Form = { nome: "", localizacao: "", rtspUrl: "", isActive: true, resolucao: "", fpsTarget: "15" }

export default function CamerasPage() {
  const { data: camerasData, loading, refetch } = useVipCamCameras()
  const cameras = camerasData ?? []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VipCamCamera | null>(null)
  const [form, setForm] = useState<Form>(empty)
  const [saving, setSaving] = useState(false)

  function openNew() {
    setEditing(null)
    setForm(empty)
    setOpen(true)
  }

  function openEdit(c: VipCamCamera) {
    setEditing(c)
    setForm({
      nome: c.nome,
      localizacao: c.localizacao ?? "",
      rtspUrl: c.rtspUrl ?? "",
      isActive: c.isActive,
      resolucao: c.resolucao ?? "",
      fpsTarget: String(c.fpsTarget),
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.nome.trim()) { toast.error("Nome obrigatório"); return }
    setSaving(true)
    try {
      const payload = {
        nome: form.nome.trim(),
        localizacao: form.localizacao.trim() || null,
        rtspUrl: form.rtspUrl.trim() || null,
        isActive: form.isActive,
        resolucao: form.resolucao.trim() || null,
        fpsTarget: parseInt(form.fpsTarget) || 15,
      }
      if (editing) {
        await updateCamera(editing.id, payload)
        toast.success("Câmera atualizada")
      } else {
        await createCamera(payload)
        toast.success("Câmera cadastrada")
      }
      setOpen(false)
      refetch()
    } catch {
      toast.error("Erro ao salvar câmera")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(c: VipCamCamera) {
    if (!confirm(`Remover câmera "${c.nome}"?`)) return
    try {
      await deleteCamera(c.id)
      toast.success("Câmera removida")
      refetch()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Câmeras</h1>
          <p className="text-muted-foreground">Gerenciamento de câmeras RTSP</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Câmera
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : cameras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma câmera cadastrada</p>
            <Button className="mt-4" onClick={openNew}>Cadastrar primeira câmera</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cameras.map((cam) => (
            <Card key={cam.id} className="relative">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="h-4 w-4 text-blue-500 shrink-0" />
                      <p className="font-medium truncate">{cam.nome}</p>
                    </div>
                    {cam.localizacao && (
                      <p className="text-xs text-muted-foreground mb-2">{cam.localizacao}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge className={cam.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                        {cam.isActive ? <><Wifi className="h-3 w-3 mr-1" />Ativa</> : <><WifiOff className="h-3 w-3 mr-1" />Inativa</>}
                      </Badge>
                      {cam.resolucao && <Badge className="bg-blue-50 text-blue-700">{cam.resolucao}</Badge>}
                      <Badge className="bg-gray-50 text-gray-600">{cam.fpsTarget} FPS</Badge>
                    </div>
                    {cam.rtspUrl && (
                      <p className="text-xs text-muted-foreground truncate font-mono">{cam.rtspUrl}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 mt-3 justify-end">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cam)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(cam)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Câmera" : "Nova Câmera"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Câmera Recepção" />
            </div>
            <div className="space-y-1">
              <Label>Localização</Label>
              <Input value={form.localizacao} onChange={(e) => setForm({ ...form, localizacao: e.target.value })} placeholder="Ex: Entrada principal" />
            </div>
            <div className="space-y-1">
              <Label>URL RTSP</Label>
              <Input value={form.rtspUrl} onChange={(e) => setForm({ ...form, rtspUrl: e.target.value })} placeholder="rtsp://user:pass@192.168.1.100/stream1" className="font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Resolução</Label>
                <Input value={form.resolucao} onChange={(e) => setForm({ ...form, resolucao: e.target.value })} placeholder="1920x1080" />
              </div>
              <div className="space-y-1">
                <Label>FPS Alvo</Label>
                <Input type="number" min="1" max="60" value={form.fpsTarget} onChange={(e) => setForm({ ...form, fpsTarget: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <Label htmlFor="isActive">Câmera ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
