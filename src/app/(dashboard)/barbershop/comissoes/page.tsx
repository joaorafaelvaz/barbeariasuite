import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ComissoesPageBarbershop from "@/components/barbershop/comissoes-page"

export default async function BarbershopComissoesPage() {
  const hasAccess = await hasModuleAccess("BARBERSHOP")
  if (!hasAccess) redirect("/")

  return <ComissoesPageBarbershop />
}
