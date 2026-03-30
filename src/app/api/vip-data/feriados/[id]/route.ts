import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.vipDataFeriado.updateMany({
    where: { id, unitId },
    data: {
      nome: body.nome,
      data: body.data ? new Date(body.data) : undefined,
      tipo: body.tipo,
      recorrente: body.recorrente,
    },
  })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipDataFeriado.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
