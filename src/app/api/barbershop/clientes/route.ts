import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const search = searchParams.get("q")

  const data = await prisma.barbershopCliente.findMany({
    where: {
      unitId,
      ...(status ? { statusCliente: status } : {}),
      ...(search
        ? {
            OR: [
              { nome: { contains: search } },
              { telefone: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { nome: "asc" },
    take: 200,
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.barbershopCliente.create({
    data: { unitId, ...body },
  })
  return apiOk(data, 201)
})
