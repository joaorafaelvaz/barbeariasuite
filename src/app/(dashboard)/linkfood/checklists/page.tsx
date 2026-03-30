import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ChecklistsPage from "@/components/linkfood/checklists-page"

export default async function LinkfoodChecklistsPage() {
  const hasAccess = await hasModuleAccess("LINKFOOD")
  if (!hasAccess) redirect("/")

  return <ChecklistsPage />
}
