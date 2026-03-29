import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaMeeting.findMany({
    where: { unitId },
    orderBy: { meetingDate: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaMeeting.create({
    data: {
      unitId,
      title: body.title,
      description: body.description,
      meetingDate: new Date(body.meeting_date),
      meetingTime: body.meeting_time,
      durationMinutes: body.duration_minutes,
      location: body.location,
      meetingType: body.meeting_type,
    },
  })
  return apiOk(data, 201)
})
