import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import BemVindosPage from "@/components/instagram/bem-vindos-page"

export default async function InstagramBemVindosRoute() {
  const hasAccess = await hasModuleAccess("INSTAGRAM")
  if (!hasAccess) redirect("/")

  return <BemVindosPage />
}
