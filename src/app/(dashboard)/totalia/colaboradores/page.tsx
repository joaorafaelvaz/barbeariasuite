import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ColaboradoresPage from "@/components/totalia/colaboradores-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <ColaboradoresPage />
}
