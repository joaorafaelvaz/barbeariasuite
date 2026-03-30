"use client"

import { useState } from "react"
import { useIgAccounts, useIgStats, useAprovacoes, useBemVindos } from "@/lib/instagram/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, CheckSquare, Users, Activity, Bot } from "lucide-react"

export default function InstagramDashboard() {
  const { accounts, loading: loadingAccounts } = useIgAccounts()
  const [selectedAccount] = useState<string | undefined>(undefined)
  const { totals, loading: loadingStats } = useIgStats(selectedAccount, 30)
  const { aprovacoes } = useAprovacoes({ status: "pending" })
  const { mensagens } = useBemVindos({ status: "pending" })

  const activeAccounts = accounts.filter((a: any) => a.config?.isActive)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Instagram Automation</h1>
        <p className="text-muted-foreground">Automação de comentários, DMs e engajamento</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              Contas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeAccounts.length}</p>
            <p className="text-xs text-muted-foreground">{accounts.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              Respostas (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals?.repliesPosted ?? 0}</p>
            <p className="text-xs text-muted-foreground">
              {totals?.repliesSimulated ?? 0} simuladas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-yellow-500" />
              Pendentes Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{aprovacoes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Boas-vindas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mensagens.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts */}
      {!loadingAccounts && accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contas Instagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {accounts.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {a.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.name}</p>
                      {a.config?.instagramUserId && (
                        <p className="text-xs text-muted-foreground">
                          ID: {a.config.instagramUserId}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={a.config?.isActive ? "default" : "secondary"}>
                    {a.config?.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats summary */}
      {!loadingStats && totals && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Resumo — Últimos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {[
                { label: "Respostas", value: totals.repliesPosted, color: "text-green-600" },
                { label: "Simuladas", value: totals.repliesSimulated, color: "text-blue-600" },
                { label: "Spam", value: totals.spamDetected, color: "text-red-600" },
                { label: "Erros", value: totals.errorsCount, color: "text-orange-600" },
                { label: "Verificações", value: totals.checksRun, color: "text-muted-foreground" },
              ].map((item) => (
                <div key={item.label}>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 && !loadingAccounts && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Bot className="h-10 w-10 mx-auto mb-4 opacity-30" />
            <p>Nenhuma conta Instagram configurada.</p>
            <p className="text-sm mt-1">
              Acesse <strong>Configuração</strong> para adicionar sua primeira conta.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
