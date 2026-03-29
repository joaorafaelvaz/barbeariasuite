import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import OportunidadesPage from "@/components/totalia/oportunidades-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <OportunidadesPage />
}
