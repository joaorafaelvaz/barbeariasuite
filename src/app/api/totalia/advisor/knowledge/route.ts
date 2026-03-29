import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaAdvisorKnowledge.findUnique({ where: { unitId } })
  return apiOk(data)
})

export const PUT = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaAdvisorKnowledge.upsert({
    where: { unitId },
    create: {
      unitId,
      knowledgeData: body.knowledge_data,
      isConfigured: body.is_configured ?? false,
      referenceNames: body.reference_names ?? [],
    },
    update: {
      knowledgeData: body.knowledge_data,
      isConfigured: body.is_configured,
      referenceNames: body.reference_names,
    },
  })
  return apiOk(data)
})
