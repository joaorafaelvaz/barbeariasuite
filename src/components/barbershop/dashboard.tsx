"use client"

import { useState } from "react"
import { useDashboardBarbershop } from "@/lib/barbershop/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Scissors, TrendingUp, TrendingDown, BarChart2 } from "lucide-react"

function pct(a: number, b: number) {
  if (!b) return null
  return ((a - b) / b) * 100
}

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}

export default function BarbershopDashboard() {
  const now = new Date()
  const [ano] = useState(now.getFullYear())
  const [mes] = useState(now.getMonth() + 1)

  const { data, loading } = useDashboardBarbershop(mes, ano)

  const nomeMes = new Date(ano, mes - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  if (loading) {
    return <p className="text-muted-foreground">Carregando dashboard...</p>
  }

  const delta = data ? pct(data.faturamento, data.faturamentoAnterior) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Barbearia</h1>
        <p className="text-muted-foreground capitalize">{nomeMes}</p>
      </div>

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Faturamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{fmt(data.faturamento)}</p>
                {delta !== null && (
                  <p
                    className={`text-xs flex items-center gap-1 mt-1 ${delta >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {delta >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(1)}% vs mês anterior
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-primary" />
                  Atendimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.atendimentos}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-blue-500" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{fmt(data.ticketMedio)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Clientes Únicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.clientesUnicos}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalClientes} total cadastrados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Por barbeiro */}
          {data.porBarbeiro?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desempenho por Barbeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.porBarbeiro
                    .sort((a: any, b: any) => b.faturamento - a.faturamento)
                    .map((b: any) => (
                      <div key={b.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{b.nome}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{b.atendimentos} atendimentos</span>
                            <span>{fmt(b.faturamento)}</span>
                          </div>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: data.faturamento
                                ? `${Math.min(100, (b.faturamento / data.faturamento) * 100)}%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evolução */}
          {data.evolucao?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolução — Últimos 6 meses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-2">Mês</th>
                        <th className="text-right py-2">Faturamento</th>
                        <th className="text-right py-2">Atendimentos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.evolucao.map((e: any) => (
                        <tr key={e.mes} className="border-b last:border-0">
                          <td className="py-2">{e.mes}</td>
                          <td className="text-right py-2 font-medium">{fmt(e.faturamento)}</td>
                          <td className="text-right py-2">{e.atendimentos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {data.atendimentos === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Scissors className="h-10 w-10 mx-auto mb-4 opacity-30" />
                <p>Nenhuma venda registrada para este mês.</p>
                <p className="text-sm mt-1">
                  Registre vendas em <strong>Vendas</strong> para ver os dados aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
