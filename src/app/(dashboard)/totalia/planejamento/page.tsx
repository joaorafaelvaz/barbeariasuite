import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import PlanejamentoPage from "@/components/totalia/planejamento-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <PlanejamentoPage />
}
