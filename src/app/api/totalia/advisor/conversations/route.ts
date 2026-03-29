import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaAdvisorConversation.findMany({
    where: { unitId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaAdvisorConversation.create({
    data: {
      unitId,
      title: body.title,
      messages: body.messages ?? [],
    },
  })
  return apiOk(data, 201)
})
