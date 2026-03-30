import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.vipDataFolga.updateMany({
    where: { id, unitId },
    data: {
      tipo: body.tipo,
      data: body.data ? new Date(body.data) : undefined,
      motivo: body.motivo,
      aprovada: body.aprovada,
    },
  })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipDataFolga.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
