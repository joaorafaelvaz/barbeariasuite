import { handle, requireUnitId, apiOk, apiError } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const data = await prisma.barbershopRegraComissao.findFirst({
    where: { id, unitId },
    include: {
      colaborador: true,
      faixas: { orderBy: { faixaOrdem: "asc" } },
    },
  })
  if (!data) return apiError("Not found", 404)
  return apiOk(data)
})

export const PUT = handle(async (req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const { faixas, ...regraBody } = body

  await prisma.barbershopRegraComissao.updateMany({
    where: { id, unitId },
    data: {
      ...(regraBody.tipo !== undefined ? { tipo: regraBody.tipo } : {}),
      ...(regraBody.percentualFixo !== undefined
        ? { percentualFixo: regraBody.percentualFixo ? parseFloat(regraBody.percentualFixo) : null }
        : {}),
      ...(regraBody.usaEscalonamento !== undefined
        ? { usaEscalonamento: regraBody.usaEscalonamento }
        : {}),
      ...(regraBody.mes !== undefined ? { mes: parseInt(regraBody.mes) } : {}),
      ...(regraBody.ano !== undefined ? { ano: parseInt(regraBody.ano) } : {}),
      ...(regraBody.colaboradorId !== undefined
        ? { colaboradorId: regraBody.colaboradorId || null }
        : {}),
    },
  })

  if (faixas) {
    await prisma.barbershopFaixaComissao.deleteMany({ where: { regraId: id } })
    if (faixas.length > 0) {
      await prisma.barbershopFaixaComissao.createMany({
        data: faixas.map((f: any, i: number) => ({
          regraId: id,
          nome: f.nome,
          percentual: parseFloat(f.percentual),
          cor: f.cor ?? null,
          faixaOrdem: i,
        })),
      })
    }
  }

  return apiOk({ ok: true })
})

export const DELETE = handle(async (_req, ctx) => {
  const unitId = await requireUnitId()
  const { id } = await ctx!.params
  await prisma.barbershopRegraComissao.deleteMany({ where: { id, unitId } })
  return apiOk({ ok: true })
})
