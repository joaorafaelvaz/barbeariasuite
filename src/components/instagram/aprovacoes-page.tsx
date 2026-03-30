"use client"

import { useState } from "react"
import { useIgAccounts, useAprovacoes } from "@/lib/instagram/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_COLORS: Record<string, any> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  auto_approved: "outline",
  posted: "default",
  failed: "destructive",
}

const SENTIMENT_COLORS: Record<string, any> = {
  positive: "default",
  neutral: "secondary",
  negative: "destructive",
  question: "outline",
  spam: "destructive",
}

export default function AprovacoesPage() {
  const { accounts } = useIgAccounts()
  const [filterAccount, setFilterAccount] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")

  const { aprovacoes, loading, updateAprovacao } = useAprovacoes({
    accountId: filterAccount || undefined,
    status: filterStatus || "all",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fila de Aprovação</h1>
        <p className="text-muted-foreground">Respostas aguardando revisão</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
        >
          <option value="">Todas as contas</option>
          {accounts.map((a: any) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {[
            { value: "pending", label: "Pendentes" },
            { value: "approved", label: "Aprovadas" },
            { value: "rejected", label: "Rejeitadas" },
            { value: "posted", label: "Publicadas" },
            { value: "all", label: "Todas" },
          ].map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={filterStatus === s.value ? "default" : "outline"}
              onClick={() => setFilterStatus(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {aprovacoes.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="py-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">
                        @{item.commenterUsername ?? "anônimo"}
                      </span>
                      <Badge variant={STATUS_COLORS[item.status] ?? "secondary"}>
                        {item.status}
                      </Badge>
                      {item.sentiment && (
                        <Badge variant={SENTIMENT_COLORS[item.sentiment] ?? "secondary"}>
                          {item.sentiment}
                        </Badge>
                      )}
                      {item.expiresAt && item.status === "pending" && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Expira {format(new Date(item.expiresAt), "HH:mm", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                    {item.commentText && (
                      <p className="text-sm text-muted-foreground mt-1">{item.commentText}</p>
                    )}
                    {item.suggestedReply && (
                      <p className="text-sm italic border-l-2 border-primary pl-2 mt-1">
                        {item.suggestedReply}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(item.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                  </div>
                </div>

                {item.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => updateAprovacao(item.id, "approve")}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAprovacao(item.id, "reject")}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {aprovacoes.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum item encontrado.</p>
          )}
        </div>
      )}
    </div>
  )
}
