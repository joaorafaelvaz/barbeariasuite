import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaProduct.update({
    where: { id },
    data: {
      name: body.name,
      sku: body.sku,
      description: body.description,
      category: body.category,
      unitOfMeasure: body.unit_of_measure,
      unitPrice: body.unit_price,
      currentStock: body.current_stock,
      minStock: body.min_stock,
      status: body.status,
      supplierId: body.supplier_id,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaProduct.delete({ where: { id } })
  return apiOk({ success: true })
})
