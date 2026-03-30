import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const take = parseInt(searchParams.get("take") ?? "20")
  const skip = parseInt(searchParams.get("skip") ?? "0")

  const [total, relatorios] = await prisma.$transaction([
    prisma.vipDataRelatorioSemanal.count({ where: { unitId } }),
    prisma.vipDataRelatorioSemanal.findMany({
      where: { unitId },
      orderBy: { semanaInicio: "desc" },
      take,
      skip,
    }),
  ])
  return apiOk({ total, relatorios })
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const relatorio = await prisma.vipDataRelatorioSemanal.create({
    data: {
      unitId,
      semanaInicio: new Date(body.semanaInicio),
      semanaFim: new Date(body.semanaFim),
      titulo: body.titulo ?? null,
      conteudo: body.conteudo ?? {},
      criadoPor: body.criadoPor ?? null,
    },
  })
  return apiOk(relatorio, 201)
})
