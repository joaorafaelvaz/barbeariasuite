import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const ano = searchParams.get("ano") ? parseInt(searchParams.get("ano")!) : new Date().getFullYear()
  const mes = searchParams.get("mes") ? parseInt(searchParams.get("mes")!) : null

  const dataInicio = mes
    ? new Date(ano, mes - 1, 1)
    : new Date(ano, 0, 1)
  const dataFim = mes
    ? new Date(ano, mes, 0, 23, 59, 59)
    : new Date(ano, 11, 31, 23, 59, 59)

  const folgas = await prisma.vipDataFolga.findMany({
    where: { unitId, data: { gte: dataInicio, lte: dataFim } },
    orderBy: { data: "asc" },
  })
  return apiOk(folgas)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const folga = await prisma.vipDataFolga.create({
    data: {
      unitId,
      colaboradorId: body.colaboradorId ?? null,
      colaboradorNome: body.colaboradorNome ?? null,
      tipo: body.tipo ?? "fixa",
      data: new Date(body.data),
      motivo: body.motivo ?? null,
      aprovada: body.aprovada ?? false,
    },
  })
  return apiOk(folga, 201)
})
