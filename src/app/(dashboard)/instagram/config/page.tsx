import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import InstagramConfigPage from "@/components/instagram/config-page"

export default async function InstagramConfigRoute() {
  const hasAccess = await hasModuleAccess("INSTAGRAM")
  if (!hasAccess) redirect("/")

  return <InstagramConfigPage />
}
