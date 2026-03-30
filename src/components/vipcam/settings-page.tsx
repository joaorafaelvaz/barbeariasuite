"use client"

import { useState, useEffect } from "react"
import { useVipCamSettings, saveSettings, type VipCamSettings } from "@/lib/vipcam/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Settings, Save } from "lucide-react"

export default function VipCamSettingsPage() {
  const { data, loading, refetch } = useVipCamSettings()
  const [form, setForm] = useState<Partial<VipCamSettings>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm({ ...data })
  }, [data])

  function num(key: keyof VipCamSettings) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveSettings(form)
      toast.success("Configurações salvas")
      refetch()
    } catch {
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações VipCam</h1>
        <p className="text-muted-foreground">Parâmetros do pipeline de análise facial</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Conexão com Backend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>URL do Serviço VipCam (Python)</Label>
            <Input
              value={form.backendUrl ?? ""}
              onChange={(e) => setForm({ ...form, backendUrl: e.target.value || null })}
              placeholder="http://localhost:8000"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">Endereço do serviço FastAPI que executa o pipeline de visão computacional</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pipelineAtivo"
              checked={form.pipelineAtivo ?? false}
              onChange={(e) => setForm({ ...form, pipelineAtivo: e.target.checked })}
            />
            <Label htmlFor="pipelineAtivo">Pipeline ativo</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parâmetros de Detecção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Limiar de reconhecimento facial</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.faceThreshold ?? 0.45}
                onChange={num("faceThreshold")}
              />
              <p className="text-xs text-muted-foreground">0 a 1 (padrão: 0.45)</p>
            </div>
            <div className="space-y-1">
              <Label>Confiança YOLO</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.yoloConfianca ?? 0.5}
                onChange={num("yoloConfianca")}
              />
              <p className="text-xs text-muted-foreground">0 a 1 (padrão: 0.5)</p>
            </div>
            <div className="space-y-1">
              <Label>EMA Alpha (suavização)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.emaAlpha ?? 0.3}
                onChange={num("emaAlpha")}
              />
              <p className="text-xs text-muted-foreground">0 a 1 (padrão: 0.3)</p>
            </div>
            <div className="space-y-1">
              <Label>FPS Alvo</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={form.fpsTarget ?? 15}
                onChange={(e) => setForm({ ...form, fpsTarget: parseInt(e.target.value) || 15 })}
              />
              <p className="text-xs text-muted-foreground">frames por segundo (padrão: 15)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
