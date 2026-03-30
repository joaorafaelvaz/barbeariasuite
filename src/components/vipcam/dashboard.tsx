"use client"

import { useVipCamDashboard } from "@/lib/vipcam/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, Smile, Activity, Wifi, WifiOff } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

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

function pctSat(v: number | null) {
  if (v === null) return "—"
  return `${(v * 100).toFixed(0)}%`
}

export default function VipCamDashboard() {
  const { data, loading } = useVipCamDashboard()

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">VIP Cam</h1>
          <p className="text-muted-foreground">Análise facial e monitoramento em tempo real</p>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            {data.pipelineAtivo ? (
              <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                <Wifi className="h-3 w-3" /> Pipeline ativo
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-500 flex items-center gap-1">
                <WifiOff className="h-3 w-3" /> Pipeline inativo
              </Badge>
            )}
          </div>
        )}
      </div>

      {data && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-500" />
                  Câmeras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.camerasAtivas}/{data.totalCameras}</p>
                <p className="text-xs text-muted-foreground mt-1">ativas / total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Pessoas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totalPessoas}</p>
                <p className="text-xs text-muted-foreground mt-1">{data.pessoasHoje} vistas hoje</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smile className="h-4 w-4 text-green-500" />
                  Satisfação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{pctSat(data.avgSatisfacao)}</p>
                <p className="text-xs text-muted-foreground mt-1">últimas 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  Ocupação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data.avgOcupacao !== null ? data.avgOcupacao.toFixed(1) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">pessoas/câmera (24h)</p>
              </CardContent>
            </Card>
          </div>

          {/* Emoções dominantes + câmeras */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Emoções */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Emoções Dominantes (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                {data.emocoesDominantes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados de emoção registrados</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={data.emocoesDominantes.map((e) => ({
                        emocao: e.emocao ?? "desconhecido",
                        count: e.count,
                      }))}
                      layout="vertical"
                      barSize={18}
                    >
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="emocao" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.emocoesDominantes.map((e) => (
                          <Cell
                            key={e.emocao ?? "desconhecido"}
                            fill={EMOCAO_CORES[e.emocao ?? "desconhecido"] ?? "#6b7280"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Câmeras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status das Câmeras</CardTitle>
              </CardHeader>
              <CardContent>
                {data.cameras.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma câmera cadastrada</p>
                ) : (
                  <div className="space-y-2">
                    {data.cameras.map((cam) => (
                      <div key={cam.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">{cam.nome}</p>
                          {cam.localizacao && (
                            <p className="text-xs text-muted-foreground">{cam.localizacao}</p>
                          )}
                        </div>
                        <Badge
                          className={cam.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"}
                        >
                          {cam.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Segmentação de pessoas */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{data.clientes}</p>
                <p className="text-sm text-muted-foreground mt-1">Clientes identificados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-purple-600">{data.colaboradores}</p>
                <p className="text-sm text-muted-foreground mt-1">Colaboradores</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-gray-500">
                  {data.totalPessoas - data.clientes - data.colaboradores}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Desconhecidos</p>
              </CardContent>
            </Card>
          </div>

          {!data.pipelineAtivo && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="py-4">
                <p className="text-sm text-yellow-800">
                  <strong>Pipeline inativo.</strong> Configure o endereço do serviço VipCam e ative o pipeline
                  nas <a href="/vipcam/settings" className="underline">configurações</a> para iniciar o monitoramento em tempo real.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
