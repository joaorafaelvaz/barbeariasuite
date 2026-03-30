import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import MetasPageBarbershop from "@/components/barbershop/metas-page"

export default async function BarbershopMetasPage() {
  const hasAccess = await hasModuleAccess("BARBERSHOP")
  if (!hasAccess) redirect("/")

  return <MetasPageBarbershop />
}
