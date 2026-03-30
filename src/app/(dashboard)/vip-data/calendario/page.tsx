import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import CalendarioPage from "@/components/vip-data/calendario-page"

export default async function VipDataCalendarioRoute() {
  const hasAccess = await hasModuleAccess("VIP_DATA")
  if (!hasAccess) redirect("/")

  return <CalendarioPage />
}
