import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import VipCamSettingsPage from "@/components/vipcam/settings-page"

export default async function VipCamSettingsRoute() {
  const hasAccess = await hasModuleAccess("VIPCAM")
  if (!hasAccess) redirect("/")
  return <VipCamSettingsPage />
}
