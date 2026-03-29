import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, apiError, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaColaborador.findMany({
    where: { unitId, ativo: true },
    orderBy: { nome: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaColaborador.create({
    data: {
      unitId,
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      cargo: body.cargo,
      area: body.area,
      areaAtuacao: body.area_atuacao,
      tipoUsuario: body.tipo_usuario ?? "colaborador",
      grupoId: body.grupo_id,
      ativo: true,
      conviteEnviado: false,
      conviteAceito: false,
    },
  })
  return apiOk(data, 201)
})
