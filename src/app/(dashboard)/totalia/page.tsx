import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import TotaliaDashboard from "@/components/totalia/dashboard"

export default async function TotaliaPage() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")

  return <TotaliaDashboard />
}
