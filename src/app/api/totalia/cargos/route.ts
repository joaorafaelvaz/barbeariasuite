import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaCargo.findMany({
    where: { unitId, ativo: true },
    orderBy: { nome: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaCargo.create({
    data: {
      unitId,
      nome: body.nome,
      descricao: body.descricao,
      area: body.area,
      nivel: body.nivel,
      salarioMin: body.salario_min,
      salarioMax: body.salario_max,
      requisitos: body.requisitos ?? [],
      responsabilidades: body.responsabilidades ?? [],
    },
  })
  return apiOk(data, 201)
})
