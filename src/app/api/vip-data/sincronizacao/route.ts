import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const take = parseInt(searchParams.get("take") ?? "20")

  const logs = await prisma.vipDataSyncLog.findMany({
    where: { unitId },
    orderBy: { iniciadoEm: "desc" },
    take,
  })

  const ultimo = logs[0] ?? null
  const totalSucesso = await prisma.vipDataSyncLog.count({ where: { unitId, status: "success" } })
  const totalErro = await prisma.vipDataSyncLog.count({ where: { unitId, status: "error" } })

  return apiOk({ logs, ultimo, totalSucesso, totalErro })
})

// POST cria um registro de sync manual (a execucao real requer worker separado)
export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const log = await prisma.vipDataSyncLog.create({
    data: {
      unitId,
      tipo: body.tipo ?? "manual",
      status: "running",
      detalhes: body.detalhes ?? null,
    },
  })
  return apiOk(log, 201)
})
