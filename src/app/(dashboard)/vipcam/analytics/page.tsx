import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import AnalyticsPage from "@/components/vipcam/analytics-page"

export default async function VipCamAnalyticsRoute() {
  const hasAccess = await hasModuleAccess("VIPCAM")
  if (!hasAccess) redirect("/")
  return <AnalyticsPage />
}
