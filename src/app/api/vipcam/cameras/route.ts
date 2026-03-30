import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const apenasAtivas = searchParams.get("ativas") === "true"

  const cameras = await prisma.vipCamCamera.findMany({
    where: { unitId, ...(apenasAtivas ? { isActive: true } : {}) },
    orderBy: { nome: "asc" },
  })
  return apiOk(cameras)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const camera = await prisma.vipCamCamera.create({
    data: {
      unitId,
      nome: body.nome,
      localizacao: body.localizacao ?? null,
      rtspUrl: body.rtspUrl ?? null,
      isActive: body.isActive ?? true,
      resolucao: body.resolucao ?? null,
      fpsTarget: body.fpsTarget ?? 15,
    },
  })
  return apiOk(camera, 201)
})
