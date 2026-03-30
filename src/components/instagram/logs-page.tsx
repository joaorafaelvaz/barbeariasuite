"use client"

import { useState } from "react"
import { useIgAccounts, useIgLogs } from "@/lib/instagram/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const TYPE_COLORS: Record<string, any> = {
  reply_posted: "default",
  reply_simulated: "secondary",
  spam_detected: "destructive",
  error: "destructive",
  bot_started: "outline",
  bot_stopped: "outline",
  check_run: "secondary",
  welcome_sent: "default",
}

const TYPE_LABELS: Record<string, string> = {
  reply_posted: "Resposta Publicada",
  reply_simulated: "Simulada",
  spam_detected: "Spam",
  error: "Erro",
  bot_started: "Bot Iniciado",
  bot_stopped: "Bot Parado",
  check_run: "Verificação",
  welcome_sent: "Boas-vindas Enviado",
}

const LOG_TYPES = Object.keys(TYPE_LABELS)

export default function LogsPage() {
  const { accounts } = useIgAccounts()
  const [filterAccount, setFilterAccount] = useState("")
  const [filterType, setFilterType] = useState("")
  const [page, setPage] = useState(1)

  const { logs, total, loading } = useIgLogs({
    accountId: filterAccount || undefined,
    type: filterType || undefined,
    page,
  })

  const totalPages = Math.ceil(total / 50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logs de Atividade</h1>
        <p className="text-muted-foreground">{total} registros no total</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterAccount}
          onChange={(e) => { setFilterAccount(e.target.value); setPage(1) }}
        >
          <option value="">Todas as contas</option>
          {accounts.map((a: any) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
        >
          <option value="">Todos os tipos</option>
          {LOG_TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t] ?? t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <>
          <div className="space-y-2">
            {logs.map((log: any) => (
              <Card key={log.id}>
                <CardContent className="py-3 flex items-start gap-3">
                  <Badge variant={TYPE_COLORS[log.type] ?? "secondary"} className="shrink-0 mt-0.5">
                    {TYPE_LABELS[log.type] ?? log.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    {log.commenterUsername && (
                      <p className="text-sm font-medium">@{log.commenterUsername}</p>
                    )}
                    {log.commentText && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {log.commentText}
                      </p>
                    )}
                    {log.replyText && (
                      <p className="text-sm italic text-muted-foreground line-clamp-2">
                        → {log.replyText}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(log.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Nenhum log encontrado.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
