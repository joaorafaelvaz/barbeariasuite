"use client"

import { useMarketingCampaigns } from "@/lib/totalia/hooks"
import { Badge } from "@/components/ui/badge"
import { Megaphone } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const fields = [
  { key: "campaign_name", label: "Nome da Campanha", required: true },
  { key: "status", label: "Status", type: "select" as const, options: ["rascunho", "planejamento", "ativa", "pausada", "concluida"] },
]

const STATUS_COLORS: Record<string, any> = {
  rascunho: "secondary",
  planejamento: "outline",
  ativa: "default",
  pausada: "outline",
  concluida: "secondary",
}

export default function MarketingPage() {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useMarketingCampaigns()

  return (
    <SimpleListPage
      title="Marketing"
      description="Campanhas e estratégias de marketing"
      icon={<Megaphone className="h-5 w-5" />}
      items={campaigns}
      loading={loading}
      fields={fields}
      onAdd={createCampaign}
      onUpdate={updateCampaign}
      onDelete={deleteCampaign}
      itemToForm={(item) => ({
        campaign_name: item.campaignName,
        status: item.status,
      })}
      displayFields={(item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{item.campaignName}</p>
            <Badge variant={STATUS_COLORS[item.status] ?? "secondary"}>{item.status}</Badge>
            {item.version > 1 && <Badge variant="outline">v{item.version}</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            Criada em {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      )}
    />
  )
}
