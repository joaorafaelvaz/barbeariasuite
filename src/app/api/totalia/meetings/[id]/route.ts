import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaMeeting.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      meetingDate: body.meeting_date ? new Date(body.meeting_date) : undefined,
      meetingTime: body.meeting_time,
      durationMinutes: body.duration_minutes,
      location: body.location,
      meetingType: body.meeting_type,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaMeeting.delete({ where: { id } })
  return apiOk({ success: true })
})
