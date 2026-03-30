import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.instagramWatchAccount.updateMany({ where: { id, unitId }, data: body })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.instagramWatchAccount.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
