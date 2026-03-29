import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ProblemasPage from "@/components/totalia/problemas-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <ProblemasPage />
}
