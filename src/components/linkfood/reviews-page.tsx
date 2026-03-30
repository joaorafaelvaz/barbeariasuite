"use client"

import { useState } from "react"
import { useReviews, useBusinesses } from "@/lib/linkfood/hooks"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Trash2, Star, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PLATFORMS = ["GOOGLE", "IFOOD", "TRIPADVISOR", "FACEBOOK", "YELP", "MANUAL"]
const PLATFORM_LABELS: Record<string, string> = {
  GOOGLE: "Google",
  IFOOD: "iFood",
  TRIPADVISOR: "TripAdvisor",
  MANUAL: "Manual",
  YELP: "Yelp",
  FACEBOOK: "Facebook",
}

const SENTIMENT_COLORS: Record<string, any> = {
  POSITIVE: "default",
  NEUTRAL: "secondary",
  NEGATIVE: "destructive",
}

const emptyForm = {
  businessId: "",
  platform: "MANUAL",
  rating: "5",
  authorName: "",
  content: "",
  reviewDate: new Date().toISOString().split("T")[0],
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const [filterBusiness, setFilterBusiness] = useState("")
  const [filterPlatform, setFilterPlatform] = useState("")
  const [filterSentiment, setFilterSentiment] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<any>(emptyForm)

  const { reviews, total, loading, createReview, deleteReview } = useReviews({
    businessId: filterBusiness || undefined,
    platform: filterPlatform || undefined,
    sentiment: filterSentiment || undefined,
  })
  const { businesses } = useBusinesses()

  const handleCreate = async () => {
    if (!form.businessId) return toast.error("Selecione um estabelecimento.")
    try {
      await createReview({
        ...form,
        rating: parseFloat(form.rating),
        reviewDate: form.reviewDate ? new Date(form.reviewDate) : null,
      })
      setShowCreate(false)
      setForm(emptyForm)
    } catch {
      toast.error("Erro ao adicionar avaliação.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remover avaliação?")) return
    try {
      await deleteReview(id)
    } catch {
      toast.error("Erro ao remover avaliação.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Avaliações</h1>
          <p className="text-muted-foreground">{total} avaliações no total</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Avaliação
        </Button>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Avaliação</DialogTitle>
            </DialogHeader>
            <ReviewForm form={form} onChange={setForm} businesses={businesses} />
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); setForm(emptyForm) }}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterBusiness}
          onChange={(e) => setFilterBusiness(e.target.value)}
        >
          <option value="">Todos os estabelecimentos</option>
          {businesses.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
        >
          <option value="">Todas as plataformas</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{PLATFORM_LABELS[p] ?? p}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {[
            { value: "", label: "Todos", icon: null },
            { value: "POSITIVE", label: "Positivas", icon: <ThumbsUp className="h-3 w-3" /> },
            { value: "NEUTRAL", label: "Neutras", icon: <Minus className="h-3 w-3" /> },
            { value: "NEGATIVE", label: "Negativas", icon: <ThumbsDown className="h-3 w-3" /> },
          ].map((s) => (
            <Button
              key={s.value}
              size="sm"
              variant={filterSentiment === s.value ? "default" : "outline"}
              onClick={() => setFilterSentiment(s.value)}
            >
              {s.icon} {s.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{r.authorName ?? "Anônimo"}</span>
                    <Badge variant="outline" className="text-xs">
                      {PLATFORM_LABELS[r.platform] ?? r.platform}
                    </Badge>
                    {r.sentiment && (
                      <Badge variant={SENTIMENT_COLORS[r.sentiment] ?? "secondary"} className="text-xs">
                        {r.sentiment === "POSITIVE" ? "Positiva" : r.sentiment === "NEGATIVE" ? "Negativa" : "Neutra"}
                      </Badge>
                    )}
                  </div>
                  <Stars rating={r.rating} />
                  {r.content && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{r.content}</p>
                  )}
                  {r.reviewDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(r.reviewDate), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {reviews.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhuma avaliação encontrada.</p>
          )}
        </div>
      )}
    </div>
  )
}

function ReviewForm({
  form,
  onChange,
  businesses,
}: {
  form: any
  onChange: (f: any) => void
  businesses: any[]
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Estabelecimento *</Label>
        <select
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          value={form.businessId}
          onChange={(e) => onChange({ ...form, businessId: e.target.value })}
        >
          <option value="">— Selecione —</option>
          {businesses.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Plataforma</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.platform}
            onChange={(e) => onChange({ ...form, platform: e.target.value })}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{PLATFORM_LABELS[p] ?? p}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Nota (1–5)</Label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.5"
            value={form.rating}
            onChange={(e) => onChange({ ...form, rating: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Nome do Avaliador</Label>
        <Input
          value={form.authorName}
          onChange={(e) => onChange({ ...form, authorName: e.target.value })}
        />
      </div>
      <div>
        <Label>Comentário</Label>
        <textarea
          className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-none"
          value={form.content}
          onChange={(e) => onChange({ ...form, content: e.target.value })}
        />
      </div>
      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={form.reviewDate}
          onChange={(e) => onChange({ ...form, reviewDate: e.target.value })}
        />
      </div>
    </div>
  )
}
