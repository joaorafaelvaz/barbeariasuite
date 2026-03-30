"use client"

import { useState } from "react"
import { useIgAccounts, useMonitoramento } from "@/lib/instagram/hooks"
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
import { Plus, Trash2, Eye, EyeOff } from "lucide-react"

const emptyForm = {
  accountId: "",
  igUsername: "",
  customPrompt: "",
  isActive: true,
  onlyNewPosts: true,
  lookbackDays: 7,
}

export default function MonitoramentoPage() {
  const { accounts } = useIgAccounts()
  const [filterAccount, setFilterAccount] = useState("")
  const { watchAccounts, loading, addWatch, updateWatch, removeWatch } =
    useMonitoramento(filterAccount || undefined)

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)

  const handleCreate = async () => {
    if (!form.igUsername) return toast.error("Username é obrigatório.")
    if (!form.accountId) return toast.error("Selecione uma conta.")
    try {
      await addWatch(form)
      setShowCreate(false)
      setForm(emptyForm)
    } catch {
      toast.error("Erro ao adicionar conta.")
    }
  }

  const toggleActive = async (item: any) => {
    await updateWatch(item.id, { isActive: !item.isActive })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Monitoramento</h1>
          <p className="text-muted-foreground">Contas monitoradas para engajamento</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Monitorar Conta
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Monitorar Nova Conta</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Conta Instagram (sua)</Label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.accountId}
                  onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                >
                  <option value="">— Selecione —</option>
                  {accounts.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Username alvo *</Label>
                <Input
                  value={form.igUsername}
                  onChange={(e) => setForm({ ...form, igUsername: e.target.value })}
                  placeholder="@concorrente"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Lookback (dias)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={form.lookbackDays}
                    onChange={(e) =>
                      setForm({ ...form, lookbackDays: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="flex items-end gap-2 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.onlyNewPosts}
                      onChange={(e) => setForm({ ...form, onlyNewPosts: e.target.checked })}
                    />
                    <span className="text-sm">Apenas posts novos</span>
                  </label>
                </div>
              </div>
              <div>
                <Label>Prompt personalizado</Label>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[70px] resize-none"
                  value={form.customPrompt}
                  onChange={(e) => setForm({ ...form, customPrompt: e.target.value })}
                  placeholder="Comente de forma natural e relevante sobre o conteúdo..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false)
                  setForm(emptyForm)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
        >
          <option value="">Todas as contas</option>
          {accounts.map((a: any) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {watchAccounts.map((w: any) => (
            <Card key={w.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">@{w.igUsername}</span>
                    <Badge variant={w.isActive ? "default" : "secondary"}>
                      {w.isActive ? "Ativo" : "Pausado"}
                    </Badge>
                    {w.onlyNewPosts && (
                      <Badge variant="outline" className="text-xs">
                        Novos posts
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>Lookback: {w.lookbackDays} dias</span>
                    {w.lastCommentedPostId && (
                      <span>Último post comentado: {w.lastCommentedPostId.slice(0, 12)}...</span>
                    )}
                  </div>
                  {w.customPrompt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                      {w.customPrompt}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(w)}>
                    {w.isActive ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => removeWatch(w.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {watchAccounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma conta monitorada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
