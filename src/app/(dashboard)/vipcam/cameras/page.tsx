import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import CamerasPage from "@/components/vipcam/cameras-page"

export default async function VipCamCamerasRoute() {
  const hasAccess = await hasModuleAccess("VIPCAM")
  if (!hasAccess) redirect("/")
  return <CamerasPage />
}
