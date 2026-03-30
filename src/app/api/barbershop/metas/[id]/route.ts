import { handle, requireUnitId, apiOk, apiError } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.barbershopMeta.updateMany({
    where: { id, unitId },
    data: {
      ...(body.tipo !== undefined ? { tipo: body.tipo } : {}),
      ...(body.valor !== undefined ? { valor: parseFloat(body.valor) } : {}),
      ...(body.mes !== undefined ? { mes: parseInt(body.mes) } : {}),
      ...(body.ano !== undefined ? { ano: parseInt(body.ano) } : {}),
      ...(body.colaboradorId !== undefined ? { colaboradorId: body.colaboradorId || null } : {}),
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.barbershopMeta.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
