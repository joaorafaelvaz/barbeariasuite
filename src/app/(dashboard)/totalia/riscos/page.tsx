import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import RiscosPage from "@/components/totalia/riscos-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <RiscosPage />
}
