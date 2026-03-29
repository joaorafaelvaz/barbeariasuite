"use client"

import { useState } from "react"
import { useFinancialAccounts, useFinancialStats, useFinancialCategories } from "@/lib/totalia/hooks"
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
import { Plus, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function FinanceiroPage() {
  const now = new Date()
  const [year] = useState(now.getFullYear())
  const [month] = useState(now.getMonth() + 1)

  const { accounts: receivable, loading: loadingR, createAccount: addR, updateAccount: updateR, deleteAccount: deleteR } = useFinancialAccounts("receivable")
  const { accounts: payable, loading: loadingP, createAccount: addP, updateAccount: updateP, deleteAccount: deleteP } = useFinancialAccounts("payable")
  const { stats } = useFinancialStats(year, month)
  const { categories } = useFinancialCategories()

  const [tab, setTab] = useState<"receivable" | "payable">("receivable")
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({ description: "", amount: "", category_id: "", due_date: "", status: "pendente" })

  const resetForm = () => setForm({ description: "", amount: "", category_id: "", due_date: "", status: "pendente" })

  const accounts = tab === "receivable" ? receivable : payable
  const addFn = tab === "receivable" ? addR : addP
  const updateFn = tab === "receivable" ? updateR : updateP
  const deleteFn = tab === "receivable" ? deleteR : deleteP

  const handleCreate = async () => {
    if (!form.description || !form.amount) return toast.error("Descrição e valor são obrigatórios.")
    try {
      await addFn({ ...form, type: tab, amount: parseFloat(form.amount) })
      setShowCreate(false)
      resetForm()
    } catch {
      toast.error("Erro ao criar lançamento.")
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    try {
      await updateFn(editing.id, { ...form, amount: parseFloat(form.amount) })
      setEditing(null)
      resetForm()
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  const openEdit = (a: any) => {
    setForm({
      description: a.description,
      amount: String(a.amount),
      category_id: a.categoryId ?? "",
      due_date: a.dueDate ? a.dueDate.split("T")[0] : "",
      status: a.status,
    })
    setEditing(a)
  }

  const STATUS_COLORS: Record<string, any> = {
    pendente: "secondary",
    pago: "default",
    cancelado: "outline",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <p className="text-muted-foreground">Contas a pagar e receber</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.total_receivable)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                A Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.total_payable)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.balance)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={tab === "receivable" ? "default" : "outline"} onClick={() => setTab("receivable")}>
            A Receber ({receivable.length})
          </Button>
          <Button variant={tab === "payable" ? "default" : "outline"} onClick={() => setTab("payable")}>
            A Pagar ({payable.length})
          </Button>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo {tab === "receivable" ? "Recebimento" : "Pagamento"}</DialogTitle>
            </DialogHeader>
            <AccountForm form={form} onChange={setForm} categories={categories} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); resetForm() }}>Cancelar</Button>
              <Button onClick={handleCreate}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {(tab === "receivable" ? loadingR : loadingP) ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {accounts.map((a: any) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{a.description}</p>
                    <Badge variant={STATUS_COLORS[a.status] ?? "secondary"}>{a.status}</Badge>
                    {a.category && <Badge variant="outline">{a.category.name}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(a.amount)}
                    </span>
                    {a.dueDate && <span>Venc: {format(new Date(a.dueDate), "dd/MM/yyyy", { locale: ptBR })}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteFn(a.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum lançamento cadastrado.</p>
          )}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) { setEditing(null); resetForm() } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lançamento</DialogTitle>
          </DialogHeader>
          <AccountForm form={form} onChange={setForm} categories={categories} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); resetForm() }}>Cancelar</Button>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AccountForm({ form, onChange, categories }: { form: any; onChange: (f: any) => void; categories: any[] }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Descrição *</Label>
        <Input value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} />
      </div>
      <div>
        <Label>Valor *</Label>
        <Input type="number" step="0.01" value={form.amount} onChange={(e) => onChange({ ...form, amount: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Categoria</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.category_id}
            onChange={(e) => onChange({ ...form, category_id: e.target.value })}
          >
            <option value="">— Nenhuma —</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Vencimento</Label>
          <Input type="date" value={form.due_date} onChange={(e) => onChange({ ...form, due_date: e.target.value })} />
        </div>
      </div>
      <div>
        <Label>Status</Label>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={form.status}
          onChange={(e) => onChange({ ...form, status: e.target.value })}
        >
          {["pendente", "pago", "cancelado"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  )
}
