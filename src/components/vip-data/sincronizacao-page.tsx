"use client"

import { useState } from "react"
import { useVipDataSincronizacao, triggerSync, type VipDataSyncLog } from "@/lib/vip-data/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { RefreshCw, CheckCircle, XCircle, Clock, Database } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

function statusIcon(status: string) {
  if (status === "success") return <CheckCircle className="h-4 w-4 text-green-500" />
  if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />
  return <Clock className="h-4 w-4 text-yellow-500" />
}

function statusBadge(status: string) {
  if (status === "success") return "bg-green-100 text-green-700"
  if (status === "error") return "bg-red-100 text-red-700"
  return "bg-yellow-100 text-yellow-700"
}

function fmtDate(d: string) {
  try { return format(new Date(d), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) } catch { return d }
}

function duration(log: VipDataSyncLog) {
  if (!log.finalizadoEm) return "em andamento"
  const ms = new Date(log.finalizadoEm).getTime() - new Date(log.iniciadoEm).getTime()
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export default function SincronizacaoPage() {
  const { data, loading, refetch } = useVipDataSincronizacao(30)
  const [triggering, setTriggering] = useState(false)

  async function handleTrigger(tipo: string) {
    setTriggering(true)
    try {
      await triggerSync(tipo)
      toast.success("Sincronização registrada — execute o worker para processar")
      refetch()
    } catch {
      toast.error("Erro ao acionar sincronização")
    } finally {
      setTriggering(false)
    }
  }

  const logs = data?.logs ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sincronização</h1>
        <p className="text-muted-foreground">Histórico e controle de integração com API externa</p>
      </div>

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              Última Sincronização
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.ultimo ? (
              <>
                <div className="flex items-center gap-2">
                  {statusIcon(data.ultimo.status)}
                  <span className="font-medium capitalize">{data.ultimo.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{fmtDate(data.ultimo.iniciadoEm)}</p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhuma</p>
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
            <p className="text-2xl font-bold">{data?.totalErro ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Acionar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acionar Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleTrigger("manual")} disabled={triggering}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Manual
            </Button>
            <Button variant="outline" onClick={() => handleTrigger("full_history")} disabled={triggering}>
              Histórico Completo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            A sincronização é processada pelo worker externo. O botão acima registra a solicitação.
          </p>
        </CardContent>
      </Card>

      {/* Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Sincronizações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-muted-foreground">Carregando...</p>
          ) : logs.length === 0 ? (
            <p className="p-6 text-muted-foreground text-center">Nenhum registro de sincronização</p>
          ) : (
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
                    <td className="px-4 py-3 text-right">{log.erros > 0 ? <span className="text-red-600">{log.erros}</span> : 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">{duration(log)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(log.iniciadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
