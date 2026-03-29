import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import TarefasPage from "@/components/totalia/tarefas-page"

export default async function Page() {
  const hasAccess = await hasModuleAccess("TOTALIA")
  if (!hasAccess) redirect("/")
  return <TarefasPage />
}
