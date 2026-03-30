"use client"

import { useVipDataDashboard } from "@/lib/vip-data/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DollarSign, Users, Scissors, Calendar, RefreshCw,
  TrendingUp, TrendingDown, Database,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

function pct(a: number, b: number) {
  if (!b) return null
  return ((a - b) / b) * 100
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    running: "bg-yellow-100 text-yellow-700",
  }
  return map[status] ?? "bg-gray-100 text-gray-700"
}

export default function VipDataDashboard() {
  const { data, loading } = useVipDataDashboard()

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  const delta = data ? pct(data.faturamentoAtual, data.faturamentoAnterior) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VIP Data</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </p>
      </div>

      {data && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{fmt(data.faturamentoAtual)}</p>
                {delta !== null && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(delta).toFixed(1)}% vs mês anterior
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-blue-500" />
                  Atendimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.atendimentos}</p>
                <p className="text-xs text-muted-foreground mt-1">Ticket médio: {fmt(data.ticketMedio)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Colaboradores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.colaboradores}</p>
                <p className="text-xs text-muted-foreground mt-1">Serviços cadastrados: {data.servicos}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Folgas no Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.folgasMes}</p>
                <p className="text-xs text-muted-foreground mt-1">registros este mês</p>
              </CardContent>
            </Card>
          </div>

          {/* Evolução */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução de Faturamento (6 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.evolucao} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ranking + Sync */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ranking do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                {data.ranking.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados</p>
                ) : (
                  <div className="space-y-2">
                    {data.ranking.slice(0, 8).map((r, i) => (
                      <div key={r.nome} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-5">{i + 1}.</span>
                          <span className="truncate max-w-[140px]">{r.nome}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{r.atendimentos} atend.</span>
                          <span className="font-medium">{fmt(r.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sync Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Sincronizações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.syncLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma sincronização registrada</p>
                ) : (
                  <div className="space-y-2">
                    {data.syncLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className={statusBadge(log.status)}>{log.status}</Badge>
                          <span className="text-muted-foreground">{log.tipo}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {format(new Date(log.iniciadoEm), "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
