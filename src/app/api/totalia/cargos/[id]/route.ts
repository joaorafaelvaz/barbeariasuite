import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaCargo.update({
    where: { id },
    data: {
      nome: body.nome,
      descricao: body.descricao,
      area: body.area,
      nivel: body.nivel,
      salarioMin: body.salario_min,
      salarioMax: body.salario_max,
      requisitos: body.requisitos,
      responsabilidades: body.responsabilidades,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaCargo.update({ where: { id }, data: { ativo: false } })
  return apiOk({ success: true })
})
