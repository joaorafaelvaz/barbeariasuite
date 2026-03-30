import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const ano = searchParams.get("ano") ? parseInt(searchParams.get("ano")!) : new Date().getFullYear()

  const feriados = await prisma.vipDataFeriado.findMany({
    where: {
      unitId,
      data: {
        gte: new Date(ano, 0, 1),
        lte: new Date(ano, 11, 31, 23, 59, 59),
      },
    },
    orderBy: { data: "asc" },
  })
  return apiOk(feriados)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const feriado = await prisma.vipDataFeriado.create({
    data: {
      unitId,
      nome: body.nome,
      data: new Date(body.data),
      tipo: body.tipo ?? "nacional",
      recorrente: body.recorrente ?? true,
    },
  })
  return apiOk(feriado, 201)
})
