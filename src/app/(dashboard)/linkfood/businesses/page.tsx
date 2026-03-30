import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import BusinessesPage from "@/components/linkfood/businesses-page"

export default async function LinkfoodBusinessesPage() {
  const hasAccess = await hasModuleAccess("LINKFOOD")
  if (!hasAccess) redirect("/")

  return <BusinessesPage />
}
