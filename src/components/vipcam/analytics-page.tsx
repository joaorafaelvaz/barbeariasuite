"use client"

import { useState } from "react"
import { useVipCamEmocoes, useVipCamCameras } from "@/lib/vipcam/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Smile, Meh, Frown, TrendingUp } from "lucide-react"

const EMOCAO_CORES: Record<string, string> = {
  felicidade: "#22c55e",
  neutro: "#94a3b8",
  surpresa: "#f59e0b",
  tristeza: "#3b82f6",
  raiva: "#ef4444",
  desprezo: "#8b5cf6",
  desgosto: "#f97316",
  medo: "#ec4899",
  desconhecido: "#6b7280",
}

const HORAS_OPTS = [
  { label: "Última hora", value: "1" },
  { label: "Últimas 6h", value: "6" },
  { label: "Últimas 24h", value: "24" },
  { label: "Últimos 3 dias", value: "72" },
  { label: "Última semana", value: "168" },
]

function pctSat(v: number | null) {
  if (v === null || v === undefined) return "—"
  return `${(v * 100).toFixed(1)}%`
}

function satisfacaoIcon(v: number | null) {
  if (v === null) return <Meh className="h-6 w-6 text-gray-400" />
  if (v >= 0.6) return <Smile className="h-6 w-6 text-green-500" />
  if (v >= 0.3) return <Meh className="h-6 w-6 text-yellow-500" />
  return <Frown className="h-6 w-6 text-red-500" />
}

export default function AnalyticsPage() {
  const [horas, setHoras] = useState("24")
  const [cameraId, setCameraId] = useState("")

  const { data: cameras } = useVipCamCameras()
  const { data: emocoes, loading } = useVipCamEmocoes({
    horas: parseInt(horas),
    cameraId: cameraId || undefined,
  })

  const distribuicao = emocoes?.distribuicao ?? []
  const resumo = emocoes?.resumo

  const pieData = distribuicao
    .filter((d) => d.count > 0)
    .map((d) => ({ name: d.emocao, value: d.count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics de Emoções</h1>
        <p className="text-muted-foreground">Análise histórica de sentimentos e satisfação</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={horas} onValueChange={(v) => { if (v) setHoras(v) }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HORAS_OPTS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={cameraId} onValueChange={(v) => { if (v !== undefined) setCameraId(v ?? "") }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas as câmeras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as câmeras</SelectItem>
            {(cameras ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <>
          {/* KPIs resumo */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{resumo?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">análises no período</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {satisfacaoIcon(resumo?.avgSatisfacao ?? null)}
                  Satisfação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pctSat(resumo?.avgSatisfacao ?? null)}</p>
                <p className="text-xs text-muted-foreground mt-1">score médio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smile className="h-4 w-4 text-green-500" />
                  Valência Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {resumo?.avgValence !== null && resumo?.avgValence !== undefined
                    ? resumo.avgValence.toFixed(3)
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">positivo = {">"} 0</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Meh className="h-4 w-4 text-orange-500" />
                  Ativação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {resumo?.avgArousal !== null && resumo?.avgArousal !== undefined
                    ? resumo.avgArousal.toFixed(3)
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">arousal médio</p>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição de emoções */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição de Emoções</CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Sem dados de emoção para o período selecionado
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={EMOCAO_CORES[entry.name] ?? "#6b7280"}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [Number(v), "registros"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhamento por Emoção</CardTitle>
              </CardHeader>
              <CardContent>
                {distribuicao.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados</p>
                ) : (
                  <div className="space-y-3">
                    {distribuicao.map((d) => {
                      const total = distribuicao.reduce((s, x) => s + x.count, 0)
                      const pct = total > 0 ? (d.count / total) * 100 : 0
                      return (
                        <div key={d.emocao}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="capitalize">{d.emocao}</span>
                            <span className="text-muted-foreground">{d.count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: EMOCAO_CORES[d.emocao] ?? "#6b7280",
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
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
