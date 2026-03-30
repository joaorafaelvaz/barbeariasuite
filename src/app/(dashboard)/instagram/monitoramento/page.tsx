import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import MonitoramentoPage from "@/components/instagram/monitoramento-page"

export default async function InstagramMonitoramentoRoute() {
  const hasAccess = await hasModuleAccess("INSTAGRAM")
  if (!hasAccess) redirect("/")

  return <MonitoramentoPage />
}
