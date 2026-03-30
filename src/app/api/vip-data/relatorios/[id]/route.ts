import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.vipDataRelatorioSemanal.updateMany({
    where: { id, unitId },
    data: {
      titulo: body.titulo,
      conteudo: body.conteudo,
    },
  })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipDataRelatorioSemanal.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
