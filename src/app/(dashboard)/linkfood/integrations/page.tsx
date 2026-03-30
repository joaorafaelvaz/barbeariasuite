import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import IntegracoesPlatformPage from "@/components/linkfood/integrations-page"

export default async function LinkfoodIntegrationsPage() {
  const hasAccess = await hasModuleAccess("LINKFOOD")
  if (!hasAccess) redirect("/")

  return <IntegracoesPlatformPage />
}
