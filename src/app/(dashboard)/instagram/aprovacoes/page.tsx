import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import AprovacoesPage from "@/components/instagram/aprovacoes-page"

export default async function InstagramAprovacoesRoute() {
  const hasAccess = await hasModuleAccess("INSTAGRAM")
  if (!hasAccess) redirect("/")

  return <AprovacoesPage />
}
