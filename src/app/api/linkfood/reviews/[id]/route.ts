import { handle, requireUnitId, apiOk, apiError } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.linkfoodReview.updateMany({
    where: { id, unitId },
    data: body,
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.linkfoodReview.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
