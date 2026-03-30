import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import PessoasPage from "@/components/vipcam/pessoas-page"

export default async function VipCamPessoasRoute() {
  const hasAccess = await hasModuleAccess("VIPCAM")
  if (!hasAccess) redirect("/")
  return <PessoasPage />
}
