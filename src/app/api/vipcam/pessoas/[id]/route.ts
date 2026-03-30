import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk, apiError } from "@/lib/totalia/crud"

export const GET = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const pessoa = await prisma.vipCamPessoa.findFirst({
    where: { id, unitId },
    include: {
      emocoes: {
        orderBy: { capturedAt: "desc" },
        take: 20,
        select: {
          emocaoDominante: true,
          satisfacaoScore: true,
          valence: true,
          capturedAt: true,
        },
      },
    },
  })
  if (!pessoa) return apiError("Pessoa nao encontrada", 404)
  return apiOk(pessoa)
})

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  await prisma.vipCamPessoa.updateMany({
    where: { id, unitId },
    data: {
      nomeExibicao: body.nomeExibicao,
      tipoPessoa: body.tipoPessoa,
    },
  })
  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.vipCamPessoa.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
