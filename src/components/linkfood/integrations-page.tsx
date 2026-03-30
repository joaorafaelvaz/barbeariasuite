"use client"

import { useState } from "react"
import { useIntegrations } from "@/lib/linkfood/hooks"
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
import { Settings, Trash2, CheckCircle } from "lucide-react"

const PLATFORM_INFO: Record<string, { label: string; fields: string[]; desc: string }> = {
  GOOGLE: {
    label: "Google Meu Negócio",
    fields: ["clientId", "clientSecret"],
    desc: "Conecte sua conta Google Business Profile para importar avaliações automaticamente.",
  },
  TRIPADVISOR: {
    label: "TripAdvisor",
    fields: ["apiKey"],
    desc: "Adicione sua chave de API do TripAdvisor.",
  },
  YELP: {
    label: "Yelp",
    fields: ["apiKey"],
    desc: "Configure a API do Yelp para monitoramento.",
  },
  FACEBOOK: {
    label: "Facebook / Instagram",
    fields: ["apiKey"],
    desc: "Conecte via token de acesso para monitorar avaliações do Facebook e Instagram.",
  },
}

export default function IntegracoesPlatformPage() {
  const { integrations, loading, saveIntegration, deleteIntegration } = useIntegrations()
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})

  const getIntegration = (platform: string) =>
    integrations.find((i: any) => i.platform === platform)

  const openEdit = (platform: string) => {
    const existing = getIntegration(platform)
    setForm({
      clientId: existing?.clientId ?? "",
      clientSecret: existing?.clientSecret ?? "",
      apiKey: existing?.apiKey ?? "",
    })
    setEditing(platform)
  }

  const handleSave = async () => {
    if (!editing) return
    try {
      await saveIntegration({
        platform: editing,
        configType: ["GOOGLE"].includes(editing) ? "OAUTH" : "API_KEY",
        ...form,
      })
      setEditing(null)
      setForm({})
    } catch {
      toast.error("Erro ao salvar integração.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover integração?")) return
    try {
      await deleteIntegration(id)
    } catch {
      toast.error("Erro ao remover integração.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">Conecte plataformas de avaliação</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(PLATFORM_INFO).map(([platform, info]) => {
            const existing = getIntegration(platform)
            return (
              <Card key={platform}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{info.label}</span>
                    {existing && (
                      <Badge className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Configurado
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{info.desc}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(platform)}>
                      <Settings className="h-3 w-3 mr-1" />
                      {existing ? "Editar" : "Configurar"}
                    </Button>
                    {existing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(existing.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null)
            setForm({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configurar {editing ? PLATFORM_INFO[editing]?.label ?? editing : ""}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              {PLATFORM_INFO[editing]?.fields.includes("clientId") && (
                <div>
                  <Label>Client ID</Label>
                  <Input
                    value={form.clientId ?? ""}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    placeholder="OAuth Client ID"
                  />
                </div>
              )}
              {PLATFORM_INFO[editing]?.fields.includes("clientSecret") && (
                <div>
                  <Label>Client Secret</Label>
                  <Input
                    type="password"
                    value={form.clientSecret ?? ""}
                    onChange={(e) => setForm({ ...form, clientSecret: e.target.value })}
                    placeholder="OAuth Client Secret"
                  />
                </div>
              )}
              {PLATFORM_INFO[editing]?.fields.includes("apiKey") && (
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={form.apiKey ?? ""}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    placeholder="Chave de API"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setForm({}) }}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
