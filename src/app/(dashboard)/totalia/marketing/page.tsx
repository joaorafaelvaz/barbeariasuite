import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import MarketingPage from "@/components/totalia/marketing-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <MarketingPage />
}
