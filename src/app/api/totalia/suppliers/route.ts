import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaSupplier.findMany({
    where: { unitId },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaSupplier.create({
    data: {
      unitId,
      name: body.name,
      cnpjCpf: body.cnpj_cpf,
      contactPerson: body.contact_person,
      email: body.email,
      phone: body.phone,
      address: body.address,
      status: body.status ?? "ativo",
      paymentTerms: body.payment_terms,
      creditLimit: body.credit_limit,
      notes: body.notes,
    },
  })
  return apiOk(data, 201)
})
