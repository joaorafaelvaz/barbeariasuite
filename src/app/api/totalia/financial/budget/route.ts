import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()))
  const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined

  const data = await prisma.totaliaBudgetPlanning.findMany({
    where: { unitId, year, ...(month ? { month } : {}) },
    include: { category: { select: { id: true, name: true, type: true, color: true } } },
    orderBy: [{ month: "asc" }, { category: { name: "asc" } }],
  })
  return apiOk(data)
})

export const PUT = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const { year, month, categoryId, plannedAmount } = body
  const data = await prisma.totaliaBudgetPlanning.upsert({
    where: { unitId_year_month_categoryId: { unitId, year, month, categoryId } },
    create: { unitId, year, month, categoryId, plannedAmount },
    update: { plannedAmount },
  })
  return apiOk(data)
})
