import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, apiError, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaColaborador.update({
    where: { id },
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      cargo: body.cargo,
      area: body.area,
      areaAtuacao: body.area_atuacao,
      tipoUsuario: body.tipo_usuario,
      grupoId: body.grupo_id,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaColaborador.update({ where: { id }, data: { ativo: false } })
  return apiOk({ success: true })
})
