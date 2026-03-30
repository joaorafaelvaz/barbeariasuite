import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const servicos = await prisma.vipDataServico.findMany({
    where: { unitId },
    orderBy: [{ ativo: "desc" }, { nome: "asc" }],
  })
  return apiOk(servicos)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const servico = await prisma.vipDataServico.create({
    data: {
      unitId,
      nome: body.nome,
      categoria: body.categoria ?? null,
      preco: body.preco ?? 0,
      duracao: body.duracao ?? null,
      ativo: body.ativo ?? true,
    },
  })
  return apiOk(servico, 201)
})
