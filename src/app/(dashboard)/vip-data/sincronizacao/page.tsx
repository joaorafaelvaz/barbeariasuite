import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import SincronizacaoPage from "@/components/vip-data/sincronizacao-page"

export default async function VipDataSincronizacaoRoute() {
  const hasAccess = await hasModuleAccess("VIP_DATA")
  if (!hasAccess) redirect("/")

  return <SincronizacaoPage />
}
