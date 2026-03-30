import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ServicosPage from "@/components/vip-data/servicos-page"

export default async function VipDataServicosRoute() {
  const hasAccess = await hasModuleAccess("VIP_DATA")
  if (!hasAccess) redirect("/")

  return <ServicosPage />
}
