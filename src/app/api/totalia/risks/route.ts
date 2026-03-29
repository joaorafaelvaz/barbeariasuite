import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaRisk.findMany({
    where: { unitId },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaRisk.create({
    data: {
      unitId,
      title: body.title,
      description: body.description,
      origin: body.origin,
      probability: body.probability,
      impact: body.impact,
      detectionDate: body.detection_date ? new Date(body.detection_date) : null,
      reviewDate: body.review_date ? new Date(body.review_date) : null,
      status: body.status ?? "identificado",
      assignedTo: body.assigned_to,
    },
  })
  return apiOk(data, 201)
})
