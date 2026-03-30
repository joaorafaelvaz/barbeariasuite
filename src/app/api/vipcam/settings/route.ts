import { prisma } from "@/lib/prisma"
import { requireUnitId, handle, apiOk } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const settings = await prisma.vipCamSettings.findUnique({ where: { unitId } })
  return apiOk(settings ?? {
    unitId,
    faceThreshold: 0.45,
    yoloConfianca: 0.5,
    emaAlpha: 0.3,
    fpsTarget: 15,
    pipelineAtivo: false,
    backendUrl: null,
  })
})

export const PUT = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const settings = await prisma.vipCamSettings.upsert({
    where: { unitId },
    create: {
      unitId,
      faceThreshold: body.faceThreshold ?? 0.45,
      yoloConfianca: body.yoloConfianca ?? 0.5,
      emaAlpha: body.emaAlpha ?? 0.3,
      fpsTarget: body.fpsTarget ?? 15,
      pipelineAtivo: body.pipelineAtivo ?? false,
      backendUrl: body.backendUrl ?? null,
    },
    update: {
      faceThreshold: body.faceThreshold,
      yoloConfianca: body.yoloConfianca,
      emaAlpha: body.emaAlpha,
      fpsTarget: body.fpsTarget,
      pipelineAtivo: body.pipelineAtivo,
      backendUrl: body.backendUrl,
    },
  })
  return apiOk(settings)
})
