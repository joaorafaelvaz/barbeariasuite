"use client"

import { useLinkfoodDashboard } from "@/lib/linkfood/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Store, MessageSquare, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PLATFORM_LABELS: Record<string, string> = {
  GOOGLE: "Google",
  IFOOD: "iFood",
  TRIPADVISOR: "TripAdvisor",
  MANUAL: "Manual",
  YELP: "Yelp",
  FACEBOOK: "Facebook",
}

const SENTIMENT_ICONS: Record<string, React.ReactNode> = {
  POSITIVE: <ThumbsUp className="h-3 w-3 text-green-500" />,
  NEUTRAL: <Minus className="h-3 w-3 text-yellow-500" />,
  NEGATIVE: <ThumbsDown className="h-3 w-3 text-red-500" />,
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
      <span className="text-xs ml-1">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function LinkfoodDashboard() {
  const { data, loading } = useLinkfoodDashboard()

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">LinkFood</h1>
        <p className="text-muted-foreground">Gestão de avaliações e presença online</p>
      </div>

      {data && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  Estabelecimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totalBusinesses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Total de Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.totalReviews}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Nota Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.avgRating?.toFixed(1) ?? "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Positivas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data.sentimentCounts?.find((s: any) => s.sentiment === "POSITIVE")?._count?.id ??
                    0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Por plataforma */}
            {data.platformCounts?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por Plataforma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.platformCounts
                      .sort((a: any, b: any) => b._count.id - a._count.id)
                      .map((p: any) => (
                        <div key={p.platform} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {PLATFORM_LABELS[p.platform] ?? p.platform}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {p._count.id} avaliações
                            </span>
                          </div>
                          <StarRating rating={p._avg.rating ?? 0} />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Por estabelecimento */}
            {data.summaries?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por Estabelecimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.summaries
                      .sort((a: any, b: any) => b.totalReviews - a.totalReviews)
                      .map((s: any) => (
                        <div key={s.businessId} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{s.business.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {s.totalReviews} avaliações
                            </p>
                          </div>
                          <StarRating rating={s.averageRating} />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recentes */}
          {data.recentReviews?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Avaliações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentReviews.map((r: any) => (
                    <div key={r.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{r.authorName ?? "Anônimo"}</span>
                          <Badge variant="outline" className="text-xs">
                            {PLATFORM_LABELS[r.platform] ?? r.platform}
                          </Badge>
                          {r.sentiment && SENTIMENT_ICONS[r.sentiment]}
                        </div>
                        <StarRating rating={r.rating} />
                        {r.content && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {r.content}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {r.reviewDate
                          ? format(new Date(r.reviewDate), "dd/MM/yy", { locale: ptBR })
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.totalReviews === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Star className="h-10 w-10 mx-auto mb-4 opacity-30" />
                <p>Nenhuma avaliação ainda.</p>
                <p className="text-sm mt-1">
                  Adicione estabelecimentos e importe avaliações em{" "}
                  <strong>Avaliações</strong>.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
