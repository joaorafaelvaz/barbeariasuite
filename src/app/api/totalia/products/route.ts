import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaProduct.findMany({
    where: { unitId },
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaProduct.create({
    data: {
      unitId,
      name: body.name,
      sku: body.sku,
      description: body.description,
      category: body.category,
      unitOfMeasure: body.unit_of_measure,
      unitPrice: body.unit_price ?? 0,
      currentStock: body.current_stock ?? 0,
      minStock: body.min_stock ?? 0,
      supplierId: body.supplier_id,
    },
  })
  return apiOk(data, 201)
})
