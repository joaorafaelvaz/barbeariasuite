import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const type = searchParams.get("type") // receita | despesa

  const data = await prisma.totaliaFinancialCategory.findMany({
    where: {
      unitId,
      ...(type ? { type } : {}),
    },
    include: {
      children: true,
    },
    orderBy: { name: "asc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaFinancialCategory.create({
    data: {
      unitId,
      name: body.name,
      type: body.type,
      parentId: body.parent_id,
      color: body.color,
    },
  })
  return apiOk(data, 201)
})
