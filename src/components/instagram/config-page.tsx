"use client"

import { useState, useEffect } from "react"
import { useIgAccounts, useIgConfig } from "@/lib/instagram/hooks"
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
import { Plus, Trash2, Settings, Bot } from "lucide-react"

function AccountConfig({ account }: { account: any }) {
  const { config, loading, saveConfig } = useIgConfig(account.id)
  const [form, setForm] = useState<any>({
    accessToken: "",
    instagramUserId: "",
    igBusinessId: "",
    checkIntervalMinutes: 5,
    postsToMonitor: 5,
    maxRepliesPerCycle: 10,
    personalityPrompt: "",
    dryRun: false,
    onlyNewComments: true,
    isActive: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (config) {
      setForm({
        accessToken: config.accessToken ?? "",
        instagramUserId: config.instagramUserId ?? "",
        igBusinessId: config.igBusinessId ?? "",
        checkIntervalMinutes: config.checkIntervalMinutes ?? 5,
        postsToMonitor: config.postsToMonitor ?? 5,
        maxRepliesPerCycle: config.maxRepliesPerCycle ?? 10,
        personalityPrompt: config.personalityPrompt ?? "",
        dryRun: config.dryRun ?? false,
        onlyNewComments: config.onlyNewComments ?? true,
        isActive: config.isActive ?? false,
      })
    }
  }, [config])

  const handleSave = async () => {
    try {
      await saveConfig(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      toast.error("Erro ao salvar configuração.")
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando...</p>

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label>Access Token</Label>
        <Input
          type="password"
          value={form.accessToken}
          onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
          placeholder="EAAxxxx..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Instagram User ID</Label>
          <Input
            value={form.instagramUserId}
            onChange={(e) => setForm({ ...form, instagramUserId: e.target.value })}
            placeholder="17841400..."
          />
        </div>
        <div>
          <Label>Business ID</Label>
          <Input
            value={form.igBusinessId}
            onChange={(e) => setForm({ ...form, igBusinessId: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Intervalo (min)</Label>
          <Input
            type="number"
            min={2}
            max={60}
            value={form.checkIntervalMinutes}
            onChange={(e) => setForm({ ...form, checkIntervalMinutes: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Posts monitorados</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={form.postsToMonitor}
            onChange={(e) => setForm({ ...form, postsToMonitor: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Máx. respostas/ciclo</Label>
          <Input
            type="number"
            min={1}
            max={50}
            value={form.maxRepliesPerCycle}
            onChange={(e) => setForm({ ...form, maxRepliesPerCycle: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <Label>Prompt de Personalidade</Label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
          value={form.personalityPrompt}
          onChange={(e) => setForm({ ...form, personalityPrompt: e.target.value })}
          placeholder="Você é um assistente simpático da Barbearia VIP. Responda comentários de forma amigável..."
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <span className="text-sm">Bot Ativo</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.dryRun}
            onChange={(e) => setForm({ ...form, dryRun: e.target.checked })}
          />
          <span className="text-sm">Modo Simulação (não publica)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.onlyNewComments}
            onChange={(e) => setForm({ ...form, onlyNewComments: e.target.checked })}
          />
          <span className="text-sm">Apenas comentários novos</span>
        </label>
      </div>
      <Button onClick={handleSave} className="w-full">
        {saved ? "Salvo!" : "Salvar Configuração"}
      </Button>
    </div>
  )
}

export default function InstagramConfigPage() {
  const { accounts, loading, createAccount, deleteAccount } = useIgAccounts()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newName.trim()) return toast.error("Nome é obrigatório.")
    await createAccount(newName.trim())
    setNewName("")
    setShowCreate(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover conta e todas suas configurações?")) return
    await deleteAccount(id)
    if (expanded === id) setExpanded(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Configuração</h1>
          <p className="text-muted-foreground">Contas Instagram e parâmetros do bot</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conta Instagram</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Nome da conta</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: @minhabarbearia"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate()
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
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
        <div className="space-y-3">
          {accounts.map((a: any) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    {a.name}
                    <Badge variant={a.config?.isActive ? "default" : "secondary"}>
                      {a.config?.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    {a.config?.dryRun && <Badge variant="outline">Simulação</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      {expanded === a.id ? "Fechar" : "Configurar"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              {expanded === a.id && (
                <CardContent className="pt-0 border-t">
                  <AccountConfig account={a} />
                </CardContent>
              )}
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma conta cadastrada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
