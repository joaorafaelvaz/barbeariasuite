import { handle, requireUnitId, apiOk, apiError } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const data = await prisma.linkfoodChecklist.findFirst({
    where: { id, unitId },
    include: {
      items: { orderBy: { order: "asc" } },
      completions: { orderBy: { completedAt: "desc" }, take: 100 },
    },
  })
  if (!data) return apiError("Not found", 404)
  return apiOk(data)
})

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const { items, ...checklistBody } = body

  await prisma.linkfoodChecklist.updateMany({
    where: { id, unitId },
    data: checklistBody,
  })

  if (items) {
    await prisma.linkfoodChecklistItem.deleteMany({ where: { checklistId: id } })
    if (items.length > 0) {
      await prisma.linkfoodChecklistItem.createMany({
        data: items.map((item: any, i: number) => ({
          checklistId: id,
          title: item.title,
          order: i,
        })),
      })
    }
  }

  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.linkfoodChecklist.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
