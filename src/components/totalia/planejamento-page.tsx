"use client"

import { useState, useEffect } from "react"
import { useStrategicPlanning } from "@/lib/totalia/hooks"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Target, Save } from "lucide-react"

export default function PlanejamentoPage() {
  const { strategicPlanning, loading, saveStrategicPlanning } = useStrategicPlanning()
  const [form, setForm] = useState({
    mission: "",
    vision: "",
    values: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (strategicPlanning) {
      setForm({
        mission: strategicPlanning.mission ?? "",
        vision: strategicPlanning.vision ?? "",
        values: strategicPlanning.values ?? "",
      })
    }
  }, [strategicPlanning])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveStrategicPlanning(form)
    } catch {
      toast.error("Erro ao salvar planejamento.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planejamento Estratégico</h1>
          <p className="text-muted-foreground">Missão, visão, valores e objetivos</p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                Missão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="sr-only">Missão</Label>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] resize-none"
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
                placeholder="Qual é a missão da empresa?"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] resize-none"
                value={form.vision}
                onChange={(e) => setForm({ ...form, vision: e.target.value })}
                placeholder="Onde a empresa quer chegar?"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] resize-none"
                value={form.values}
                onChange={(e) => setForm({ ...form, values: e.target.value })}
                placeholder="Quais são os valores da empresa?"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
