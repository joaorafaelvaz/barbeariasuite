import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const data = await prisma.totaliaAdvisorConversation.findUnique({ where: { id } })
  return apiOk(data)
})

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaAdvisorConversation.update({
    where: { id },
    data: {
      title: body.title,
      messages: body.messages,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaAdvisorConversation.delete({ where: { id } })
  return apiOk({ success: true })
})
