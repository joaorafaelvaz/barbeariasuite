import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ClientesPageBarbershop from "@/components/barbershop/clientes-page"

export default async function BarbershopClientesPage() {
  const hasAccess = await hasModuleAccess("BARBERSHOP")
  if (!hasAccess) redirect("/")

  return <ClientesPageBarbershop />
}
