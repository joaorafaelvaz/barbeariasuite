import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import VendasPageBarbershop from "@/components/barbershop/vendas-page"

export default async function BarbershopVendasPage() {
  const hasAccess = await hasModuleAccess("BARBERSHOP")
  if (!hasAccess) redirect("/")

  return <VendasPageBarbershop />
}
