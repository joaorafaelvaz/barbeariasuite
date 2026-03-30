import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get("tipo") // cliente | colaborador | unknown
  const busca = searchParams.get("busca") ?? ""
  const take = parseInt(searchParams.get("take") ?? "50")
  const skip = parseInt(searchParams.get("skip") ?? "0")

  const where = {
    unitId,
    ...(tipo ? { tipoPessoa: tipo } : {}),
    ...(busca ? { nomeExibicao: { contains: busca } } : {}),
  }

  const [total, pessoas] = await prisma.$transaction([
    prisma.vipCamPessoa.count({ where }),
    prisma.vipCamPessoa.findMany({
      where,
      orderBy: { ultimaVista: "desc" },
      take,
      skip,
    }),
  ])

  return apiOk({ total, pessoas })
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const pessoa = await prisma.vipCamPessoa.create({
    data: {
      unitId,
      nomeExibicao: body.nomeExibicao ?? null,
      tipoPessoa: body.tipoPessoa ?? "unknown",
    },
  })
  return apiOk(pessoa, 201)
})
