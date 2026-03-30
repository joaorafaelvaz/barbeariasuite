import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import LogsPage from "@/components/instagram/logs-page"

export default async function InstagramLogsRoute() {
  const hasAccess = await hasModuleAccess("INSTAGRAM")
  if (!hasAccess) redirect("/")

  return <LogsPage />
}
