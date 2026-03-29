import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ProcessosPage from "@/components/totalia/processos-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <ProcessosPage />
}
