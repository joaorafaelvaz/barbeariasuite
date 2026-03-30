"use client"

import { useState } from "react"
import {
  useVipDataFolgas, useVipDataFeriados,
  createFolga, deleteFolga, createFeriado, deleteFeriado,
  type VipDataFolga, type VipDataFeriado,
} from "@/lib/vip-data/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const TIPOS_FOLGA = ["fixa", "flutuante", "ferias", "falta"]
const TIPOS_FERIADO = ["nacional", "estadual", "municipal", "custom"]

const now = new Date()

export default function CalendarioPage() {
  const [ano, setAno] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [openFolga, setOpenFolga] = useState(false)
  const [openFeriado, setOpenFeriado] = useState(false)
  const [savingFolga, setSavingFolga] = useState(false)
  const [savingFeriado, setSavingFeriado] = useState(false)

  const { data: folgasData, loading: loadFolgas, refetch: mutateFolgas } = useVipDataFolgas({ ano, mes })
  const { data: feriadosData, loading: loadFeriados, refetch: mutateFeriados } = useVipDataFeriados(ano)
  const folgas = folgasData ?? []
  const feriados = feriadosData ?? []

  const [folgaForm, setFolgaForm] = useState({ colaboradorNome: "", tipo: "fixa", data: "", motivo: "" })
  const [feriadoForm, setFeriadoForm] = useState({ nome: "", data: "", tipo: "nacional", recorrente: true })

  async function handleAddFolga() {
    if (!folgaForm.data) { toast.error("Informe a data"); return }
    setSavingFolga(true)
    try {
      await createFolga({
        colaboradorNome: folgaForm.colaboradorNome || null,
        tipo: folgaForm.tipo,
        data: folgaForm.data,
        motivo: folgaForm.motivo || null,
      })
      toast.success("Folga registrada")
      setOpenFolga(false)
      setFolgaForm({ colaboradorNome: "", tipo: "fixa", data: "", motivo: "" })
      mutateFolgas()
    } catch {
      toast.error("Erro ao registrar folga")
    } finally {
      setSavingFolga(false)
    }
  }

  async function handleDeleteFolga(f: VipDataFolga) {
    if (!confirm("Remover folga?")) return
    try {
      await deleteFolga(f.id)
      toast.success("Folga removida")
      mutateFolgas()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  async function handleAddFeriado() {
    if (!feriadoForm.nome.trim() || !feriadoForm.data) { toast.error("Preencha nome e data"); return }
    setSavingFeriado(true)
    try {
      await createFeriado({ ...feriadoForm })
      toast.success("Feriado registrado")
      setOpenFeriado(false)
      setFeriadoForm({ nome: "", data: "", tipo: "nacional", recorrente: true })
      mutateFeriados()
    } catch {
      toast.error("Erro ao registrar feriado")
    } finally {
      setSavingFeriado(false)
    }
  }

  async function handleDeleteFeriado(f: VipDataFeriado) {
    if (!confirm("Remover feriado?")) return
    try {
      await deleteFeriado(f.id)
      toast.success("Feriado removido")
      mutateFeriados()
    } catch {
      toast.error("Erro ao remover")
    }
  }

  function fmtDate(d: string) {
    try { return format(new Date(d), "dd/MM/yyyy", { locale: ptBR }) } catch { return d }
  }

  const tipoFolgaBadge: Record<string, string> = {
    fixa: "bg-blue-100 text-blue-700",
    flutuante: "bg-yellow-100 text-yellow-700",
    ferias: "bg-green-100 text-green-700",
    falta: "bg-red-100 text-red-700",
  }

  const tipoFeriadoBadge: Record<string, string> = {
    nacional: "bg-purple-100 text-purple-700",
    estadual: "bg-blue-100 text-blue-700",
    municipal: "bg-orange-100 text-orange-700",
    custom: "bg-gray-100 text-gray-700",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendário</h1>
          <p className="text-muted-foreground">Folgas e feriados da unidade</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(mes)} onValueChange={(v) => { if (v) setMes(parseInt(v)) }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {new Date(2024, i, 1).toLocaleDateString("pt-BR", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <Tabs defaultValue="folgas">
        <TabsList>
          <TabsTrigger value="folgas">Folgas ({folgas.length})</TabsTrigger>
          <TabsTrigger value="feriados">Feriados ({feriados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="folgas" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setOpenFolga(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Folga
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadFolgas ? (
                <p className="p-6 text-muted-foreground">Carregando...</p>
              ) : folgas.length === 0 ? (
                <p className="p-6 text-muted-foreground text-center">Nenhuma folga registrada</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">Data</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Colaborador</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Motivo</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {folgas.map((f) => (
                      <tr key={f.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{fmtDate(f.data)}</td>
                        <td className="px-4 py-3">{f.colaboradorNome ?? <span className="text-muted-foreground">Unidade</span>}</td>
                        <td className="px-4 py-3">
                          <Badge className={tipoFolgaBadge[f.tipo] ?? "bg-gray-100 text-gray-700"}>{f.tipo}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{f.motivo ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Badge className={f.aprovada ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {f.aprovada ? "Aprovada" : "Pendente"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteFolga(f)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feriados" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setOpenFeriado(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Feriado
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {loadFeriados ? (
                <p className="p-6 text-muted-foreground">Carregando...</p>
              ) : feriados.length === 0 ? (
                <p className="p-6 text-muted-foreground text-center">Nenhum feriado cadastrado</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium text-muted-foreground">Data</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Feriado</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Recorrente</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {feriados.map((f) => (
                      <tr key={f.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{fmtDate(f.data)}</td>
                        <td className="px-4 py-3 font-medium">{f.nome}</td>
                        <td className="px-4 py-3">
                          <Badge className={tipoFeriadoBadge[f.tipo] ?? "bg-gray-100 text-gray-700"}>{f.tipo}</Badge>
                        </td>
                        <td className="px-4 py-3">{f.recorrente ? "Sim" : "Não"}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteFeriado(f)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Folga Dialog */}
      <Dialog open={openFolga} onOpenChange={setOpenFolga}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Folga</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Colaborador (opcional)</Label>
              <Input
                value={folgaForm.colaboradorNome}
                onChange={(e) => setFolgaForm({ ...folgaForm, colaboradorNome: e.target.value })}
                placeholder="Nome do colaborador (vazio = unidade)"
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={folgaForm.tipo} onValueChange={(v) => { if (v) setFolgaForm({ ...folgaForm, tipo: v }) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_FOLGA.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Data *</Label>
              <Input
                type="date"
                value={folgaForm.data}
                onChange={(e) => setFolgaForm({ ...folgaForm, data: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Motivo</Label>
              <Input
                value={folgaForm.motivo}
                onChange={(e) => setFolgaForm({ ...folgaForm, motivo: e.target.value })}
                placeholder="Motivo da folga..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenFolga(false)}>Cancelar</Button>
            <Button onClick={handleAddFolga} disabled={savingFolga}>
              {savingFolga ? "Salvando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feriado Dialog */}
      <Dialog open={openFeriado} onOpenChange={setOpenFeriado}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Feriado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input
                value={feriadoForm.nome}
                onChange={(e) => setFeriadoForm({ ...feriadoForm, nome: e.target.value })}
                placeholder="Ex: Carnaval"
              />
            </div>
            <div className="space-y-1">
              <Label>Data *</Label>
              <Input
                type="date"
                value={feriadoForm.data}
                onChange={(e) => setFeriadoForm({ ...feriadoForm, data: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={feriadoForm.tipo} onValueChange={(v) => { if (v) setFeriadoForm({ ...feriadoForm, tipo: v }) }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_FERIADO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recorrente"
                checked={feriadoForm.recorrente}
                onChange={(e) => setFeriadoForm({ ...feriadoForm, recorrente: e.target.checked })}
              />
              <Label htmlFor="recorrente">Recorrente (anual)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenFeriado(false)}>Cancelar</Button>
            <Button onClick={handleAddFeriado} disabled={savingFeriado}>
              {savingFeriado ? "Salvando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
