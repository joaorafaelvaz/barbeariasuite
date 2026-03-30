import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.vipCamCamera.updateMany({
    where: { id, unitId },
    data: {
      nome: body.nome,
      localizacao: body.localizacao,
      rtspUrl: body.rtspUrl,
      isActive: body.isActive,
      resolucao: body.resolucao,
      fpsTarget: body.fpsTarget,
    },
  })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipCamCamera.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
