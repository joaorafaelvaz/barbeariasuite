"use client"

import { useState, useEffect } from "react"
import { useVipDataSincronizacao, type VipDataSyncLog } from "@/lib/vip-data/hooks"
import { useFetch } from "@/lib/totalia/use-fetch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  RefreshCw, CheckCircle, XCircle, Clock,
  Database, Wifi, WifiOff, Loader2, AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ErpStatus {
  configured: boolean
  connected: boolean
  versao?: string
  message?: string
}

interface Unit {
  id: string
  name: string
  erpId: number | null
}

function statusIcon(status: string) {
  if (status === "success") return <CheckCircle className="h-4 w-4 text-green-500" />
  if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />
  return <Clock className="h-4 w-4 animate-pulse text-yellow-500" />
}

function statusBadge(status: string) {
  if (status === "success") return "bg-green-100 text-green-700"
  if (status === "error") return "bg-red-100 text-red-700"
  return "bg-yellow-100 text-yellow-700"
}

function fmtDate(d: string) {
  try { return format(new Date(d), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) }
  catch { return d }
}

function duration(log: VipDataSyncLog) {
  if (!log.finalizadoEm) return "em andamento"
  const ms = new Date(log.finalizadoEm).getTime() - new Date(log.iniciadoEm).getTime()
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

const ENTIDADES = [
  { key: "colaboradores", label: "Colaboradores" },
  { key: "clientes", label: "Clientes" },
  { key: "servicos", label: "Serviços/Produtos" },
  { key: "folgas", label: "Folgas" },
  { key: "vendas", label: "Vendas" },
]

export default function SincronizacaoPage() {
  const { data, loading, refetch } = useVipDataSincronizacao(30)
  const { data: erpStatus } = useFetch<ErpStatus>("/api/erp/status")
  const { data: unitsData } = useFetch<Unit[]>("/api/units")

  const [syncing, setSyncing] = useState(false)
  const [unitId, setUnitId] = useState<string>("")
  const [entidades, setEntidades] = useState<string[]>(ENTIDADES.map((e) => e.key))
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const units = (unitsData ?? []).filter((u) => u.erpId != null)

  // Selecionar primeira unidade disponível automaticamente
  useEffect(() => {
    if (units.length > 0 && !unitId) setUnitId(units[0].id)
  }, [units, unitId])

  function toggleEntidade(key: string) {
    setEntidades((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
    )
  }

  async function handleSync() {
    if (!unitId) { toast.error("Selecione uma unidade"); return }
    if (entidades.length === 0) { toast.error("Selecione pelo menos uma entidade"); return }

    setSyncing(true)
    try {
      const body: Record<string, unknown> = { unitId, entidades }
      if (dataInicio) body.dataInicio = dataInicio
      if (dataFim) body.dataFim = dataFim

      const res = await fetch("/api/erp/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? "Erro ao sincronizar")
      } else {
        const t = json.total as { inserted: number; updated: number; errors: number }
        toast.success(
          `Sync concluído — ${t.inserted} inseridos, ${t.updated} atualizados, ${t.errors} erros`
        )
        refetch()
      }
    } catch {
      toast.error("Erro de conexão")
    } finally {
      setSyncing(false)
    }
  }

  const logs = data?.logs ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sincronização ERP</h1>
        <p className="text-muted-foreground">
          Integração direta com o banco de dados <code className="text-xs bg-muted px-1 rounded">franquia_producao</code>
        </p>
      </div>

      {/* Status ERP */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {erpStatus?.connected
                ? <Wifi className="h-4 w-4 text-green-500" />
                : <WifiOff className="h-4 w-4 text-red-400" />}
              Conexão ERP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!erpStatus ? (
              <p className="text-sm text-muted-foreground">Verificando...</p>
            ) : erpStatus.connected ? (
              <>
                <Badge className="bg-green-100 text-green-700">Conectado</Badge>
                <p className="text-xs text-muted-foreground mt-1">MySQL {erpStatus.versao}</p>
              </>
            ) : erpStatus.configured ? (
              <>
                <Badge className="bg-red-100 text-red-700">Falha</Badge>
                <p className="text-xs text-muted-foreground mt-1">{erpStatus.message}</p>
              </>
            ) : (
              <>
                <Badge variant="outline">Não configurado</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione ERP_DB_* no .env
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Sucesso Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalSucesso ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Erros Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{data?.totalErro ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Aviso sem erpId */}
      {units.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">
              Nenhuma unidade possui <strong>ERP ID</strong> vinculado.
              Vá em <strong>Configurações → Unidades</strong>, edite cada unidade e
              preencha o campo <strong>ID do ERP</strong> correspondente ao campo{" "}
              <code className="text-xs bg-yellow-100 px-1 rounded">unidades.id</code> do banco.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Painel de sync */}
      {erpStatus?.connected && units.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acionar Sincronização</CardTitle>
            <CardDescription>
              Selecione a unidade, as entidades e o período desejado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Unidade */}
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={unitId} onValueChange={(v) => { if (v) setUnitId(v) }}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar unidade" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} <span className="text-muted-foreground text-xs ml-1">(ERP #{u.erpId})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entidades */}
            <div className="space-y-2">
              <Label>Entidades</Label>
              <div className="flex flex-wrap gap-2">
                {ENTIDADES.map((e) => {
                  const active = entidades.includes(e.key)
                  return (
                    <button
                      key={e.key}
                      type="button"
                      onClick={() => toggleEntidade(e.key)}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                        active
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-muted-foreground border-input hover:border-foreground"
                      }`}
                    >
                      {e.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Período (apenas para vendas) */}
            {entidades.includes("vendas") && (
              <div className="space-y-2">
                <Label>Período das vendas (opcional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    className="w-40"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                  <span className="text-muted-foreground text-sm">até</span>
                  <Input
                    type="date"
                    className="w-40"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setDataInicio(""); setDataFim("") }}
                  >
                    Limpar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sem período: sincroniza as últimas 10.000 vendas. Recomendado filtrar por mês na primeira execução.
                </p>
              </div>
            )}

            <Button onClick={handleSync} disabled={syncing} className="gap-2">
              {syncing
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <RefreshCw className="h-4 w-4" />}
              {syncing ? "Sincronizando..." : "Sincronizar Agora"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Histórico de Sincronizações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          ) : logs.length === 0 ? (
            <p className="p-6 text-muted-foreground text-center">Nenhum registro ainda</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Registros</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Erros</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Duração</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Iniciado em</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {statusIcon(log.status)}
                          <Badge className={statusBadge(log.status)}>{log.status}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{log.tipo}</td>
                      <td className="px-4 py-3 text-right">{log.registrosSincronizados}</td>
                      <td className="px-4 py-3 text-right">
                        {log.erros > 0
                          ? <span className="text-red-600 font-medium">{log.erros}</span>
                          : <span className="text-muted-foreground">0</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{duration(log)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{fmtDate(log.iniciadoEm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
