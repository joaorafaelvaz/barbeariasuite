import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaPaymentMethod.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      isActive: body.is_active,
      discountPercentage: body.discount_percentage,
      paymentDays: body.payment_days,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaPaymentMethod.delete({ where: { id } })
  return apiOk({ success: true })
})
