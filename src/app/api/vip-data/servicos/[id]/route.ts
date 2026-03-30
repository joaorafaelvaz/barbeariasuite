import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk, apiError } from "@/lib/totalia/crud"

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const servico = await prisma.vipDataServico.updateMany({
    where: { id, unitId },
    data: {
      nome: body.nome,
      categoria: body.categoria,
      preco: body.preco,
      duracao: body.duracao,
      ativo: body.ativo,
    },
  })
  if (servico.count === 0) return apiError("Nao encontrado", 404)
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipDataServico.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
