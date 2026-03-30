import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get("mes")
  const ano = searchParams.get("ano")

  const data = await prisma.barbershopMeta.findMany({
    where: {
      unitId,
      ...(mes ? { mes: parseInt(mes) } : {}),
      ...(ano ? { ano: parseInt(ano) } : {}),
    },
    include: { colaborador: true },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.barbershopMeta.create({
    data: {
      unitId,
      tipo: body.tipo,
      valor: parseFloat(body.valor),
      mes: parseInt(body.mes),
      ano: parseInt(body.ano),
      ...(body.colaboradorId ? { colaboradorId: body.colaboradorId } : {}),
    },
  })
  return apiOk(data, 201)
})
