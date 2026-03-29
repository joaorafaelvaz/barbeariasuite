import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaSupplier.update({
    where: { id },
    data: {
      name: body.name,
      cnpjCpf: body.cnpj_cpf,
      contactPerson: body.contact_person,
      email: body.email,
      phone: body.phone,
      address: body.address,
      status: body.status,
      paymentTerms: body.payment_terms,
      creditLimit: body.credit_limit,
      notes: body.notes,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaSupplier.delete({ where: { id } })
  return apiOk({ success: true })
})
