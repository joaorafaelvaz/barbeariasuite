import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const colaboradorId = searchParams.get("colaboradorId")
  const clienteId = searchParams.get("clienteId")
  const dataInicio = searchParams.get("dataInicio")
  const dataFim = searchParams.get("dataFim")

  const data = await prisma.barbershopVenda.findMany({
    where: {
      unitId,
      ...(colaboradorId ? { colaboradorId } : {}),
      ...(clienteId ? { clienteId } : {}),
      ...(dataInicio || dataFim
        ? {
            vendaData: {
              ...(dataInicio ? { gte: new Date(dataInicio) } : {}),
              ...(dataFim ? { lte: new Date(dataFim) } : {}),
            },
          }
        : {}),
    },
    orderBy: { vendaData: "desc" },
    take: 500,
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.barbershopVenda.upsert({
    where: { unitId_vendaId: { unitId, vendaId: body.vendaId ?? body.id ?? "" } },
    create: { unitId, ...body },
    update: body,
  })
  return apiOk(data, 201)
})
