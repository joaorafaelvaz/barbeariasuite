import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import FinanceiroPage from "@/components/totalia/financeiro-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <FinanceiroPage />
}
