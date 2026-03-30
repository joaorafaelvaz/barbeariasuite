"use client"

import { useState } from "react"
import { useIgAccounts, useBemVindos } from "@/lib/instagram/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, X, Users } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_COLORS: Record<string, any> = {
  pending: "secondary",
  sent: "default",
  dismissed: "outline",
}

export default function BemVindosPage() {
  const { accounts } = useIgAccounts()
  const [filterAccount, setFilterAccount] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")

  const { mensagens, loading, updateStatus } = useBemVindos({
    accountId: filterAccount || undefined,
    status: filterStatus || undefined,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Boas-vindas</h1>
        <p className="text-muted-foreground">Mensagens de boas-vindas para novos seguidores</p>
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
            { value: "pending", label: `Pendentes (${filterStatus === "pending" ? mensagens.length : "?"})` },
            { value: "sent", label: "Enviadas" },
            { value: "dismissed", label: "Descartadas" },
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
          {mensagens.map((m: any) => (
            <Card key={m.id}>
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">@{m.followerUsername}</span>
                        <Badge variant={STATUS_COLORS[m.status] ?? "secondary"}>
                          {m.status}
                        </Badge>
                        {m.followerFollowersCount != null && (
                          <span className="text-xs text-muted-foreground">
                            {m.followerFollowersCount} seguidores
                          </span>
                        )}
                      </div>
                      {m.followerBio && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {m.followerBio}
                        </p>
                      )}
                      {m.generatedMessage && (
                        <p className="text-sm italic border-l-2 border-primary pl-2 mt-1">
                          {m.generatedMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(m.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                    {m.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateStatus(m.id, "sent")}>
                          <Send className="h-3 w-3 mr-1" />
                          Enviado
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(m.id, "dismissed")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {mensagens.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhuma mensagem encontrada.</p>
          )}
        </div>
      )}
    </div>
  )
}
