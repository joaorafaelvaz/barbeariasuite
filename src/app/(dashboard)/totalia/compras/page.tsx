import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ComprasPage from "@/components/totalia/compras-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <ComprasPage />
}
