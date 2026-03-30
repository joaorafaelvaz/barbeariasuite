import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.linkfoodChecklist.findMany({
    where: { unitId },
    include: {
      items: { orderBy: { order: "asc" } },
    },
    orderBy: { title: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const { items, ...checklistBody } = body

  const data = await prisma.linkfoodChecklist.create({
    data: {
      unitId,
      ...checklistBody,
      ...(items?.length
        ? {
            items: {
              create: items.map((item: any, i: number) => ({
                title: item.title,
                order: i,
              })),
            },
          }
        : {}),
    },
    include: { items: { orderBy: { order: "asc" } } },
  })
  return apiOk(data, 201)
})
