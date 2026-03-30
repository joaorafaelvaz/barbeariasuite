"use client"

import { useState } from "react"
import { useVendasBarbershop, useColaboradoresBarbershop } from "@/lib/barbershop/hooks"
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
import { Plus, Trash2, Scissors } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const emptyForm = {
  vendaId: "",
  colaboradorNome: "",
  clienteNome: "",
  produto: "",
  categoria: "servico",
  valorBruto: "",
  valorLiquido: "",
  formaPagamento: "",
  vendaData: new Date().toISOString().split("T")[0],
}

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

export default function VendasPageBarbershop() {
  const now = new Date()
  const [dataInicio, setDataInicio] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  )
  const [dataFim, setDataFim] = useState(now.toISOString().split("T")[0])

  const { vendas, loading, createVenda, deleteVenda } = useVendasBarbershop({
    dataInicio,
    dataFim,
  })
  const { colaboradores } = useColaboradoresBarbershop()

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)

  const totalFaturamento = vendas.reduce((s: number, v: any) => s + (v.valorLiquido ?? 0), 0)

  const handleCreate = async () => {
    if (!form.produto) return toast.error("Produto/serviço é obrigatório.")
    try {
      await createVenda({
        ...form,
        vendaId: form.vendaId || `manual-${Date.now()}`,
        valorBruto: form.valorBruto ? parseFloat(form.valorBruto) : null,
        valorLiquido: form.valorLiquido ? parseFloat(form.valorLiquido) : null,
        vendaData: form.vendaData ? new Date(form.vendaData) : null,
      })
      setShowCreate(false)
      setForm(emptyForm)
    } catch {
      toast.error("Erro ao registrar venda.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover venda?")) return
    try {
      await deleteVenda(id)
    } catch {
      toast.error("Erro ao remover venda.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-muted-foreground">Registro de atendimentos e vendas</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <VendaForm form={form} onChange={setForm} colaboradores={colaboradores} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(emptyForm) }}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <Label className="text-xs">Data início</Label>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-40"
          />
        </div>
        <div>
          <Label className="text-xs">Data fim</Label>
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {vendas.length} venda(s) — Total: <strong>{fmt(totalFaturamento)}</strong>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {vendas.map((v: any) => (
            <Card key={v.id}>
              <CardContent className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <Scissors className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{v.produto}</p>
                      {v.categoria && (
                        <Badge variant="outline" className="text-xs">
                          {v.categoria}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                      {v.colaboradorNome && <span>{v.colaboradorNome}</span>}
                      {v.clienteNome && <span>{v.clienteNome}</span>}
                      {v.vendaData && (
                        <span>
                          {format(new Date(v.vendaData), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      )}
                      {v.formaPagamento && <span>{v.formaPagamento}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-green-600">
                    {fmt(v.valorLiquido ?? v.valorBruto ?? 0)}
                  </p>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {vendas.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma venda no período selecionado.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function VendaForm({
  form,
  onChange,
  colaboradores,
}: {
  form: any
  onChange: (f: any) => void
  colaboradores: any[]
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Produto / Serviço *</Label>
        <Input
          value={form.produto}
          onChange={(e) => onChange({ ...form, produto: e.target.value })}
          placeholder="Ex: Corte + Barba"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Categoria</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.categoria}
            onChange={(e) => onChange({ ...form, categoria: e.target.value })}
          >
            <option value="servico">Serviço</option>
            <option value="produto">Produto</option>
          </select>
        </div>
        <div>
          <Label>Data</Label>
          <Input
            type="date"
            value={form.vendaData}
            onChange={(e) => onChange({ ...form, vendaData: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Valor Bruto</Label>
          <Input
            type="number"
            step="0.01"
            value={form.valorBruto}
            onChange={(e) => onChange({ ...form, valorBruto: e.target.value })}
            placeholder="0,00"
          />
        </div>
        <div>
          <Label>Valor Líquido</Label>
          <Input
            type="number"
            step="0.01"
            value={form.valorLiquido}
            onChange={(e) => onChange({ ...form, valorLiquido: e.target.value })}
            placeholder="0,00"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Barbeiro</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.colaboradorNome}
            onChange={(e) => onChange({ ...form, colaboradorNome: e.target.value })}
          >
            <option value="">— Nenhum —</option>
            {colaboradores.map((c: any) => (
              <option key={c.id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Forma de Pagamento</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.formaPagamento}
            onChange={(e) => onChange({ ...form, formaPagamento: e.target.value })}
          >
            <option value="">— Selecione —</option>
            {["Dinheiro", "Cartão Débito", "Cartão Crédito", "PIX", "Outro"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label>Nome do Cliente</Label>
        <Input
          value={form.clienteNome}
          onChange={(e) => onChange({ ...form, clienteNome: e.target.value })}
          placeholder="Nome do cliente (opcional)"
        />
      </div>
    </div>
  )
}
