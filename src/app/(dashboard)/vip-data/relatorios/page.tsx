import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import RelatoriosPage from "@/components/vip-data/relatorios-page"

export default async function VipDataRelatoriosRoute() {
  const hasAccess = await hasModuleAccess("VIP_DATA")
  if (!hasAccess) redirect("/")

  return <RelatoriosPage />
}
