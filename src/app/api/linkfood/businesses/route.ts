import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.linkfoodBusiness.findMany({
    where: { unitId },
    include: { reviewSummary: true },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.linkfoodBusiness.create({
    data: { unitId, ...body },
  })
  return apiOk(data, 201)
})
