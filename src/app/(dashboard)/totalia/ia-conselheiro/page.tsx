import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import IAConselheiroPage from "@/components/totalia/ia-conselheiro-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <IAConselheiroPage />
}
