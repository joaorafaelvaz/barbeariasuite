import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ColaboradoresPageBarbershop from "@/components/barbershop/colaboradores-page"

export default async function BarbershopColaboradoresPage() {
  const hasAccess = await hasModuleAccess("BARBERSHOP")
  if (!hasAccess) redirect("/")

  return <ColaboradoresPageBarbershop />
}
