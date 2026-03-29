import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import { Card, CardContent } from "@/components/ui/card"

export default async function VipcamPage() {
  const hasAccess = await hasModuleAccess("VIPCAM")
  if (!hasAccess) redirect("/")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">VIP Cam</h1>
        <p className="text-muted-foreground">Modulo em desenvolvimento</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-lg text-muted-foreground">Em breve</p>
          <p className="text-sm text-muted-foreground mt-2">
            Este modulo sera migrado para a plataforma unificada.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
