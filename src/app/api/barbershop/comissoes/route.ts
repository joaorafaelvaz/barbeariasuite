import { handle, requireUnitId, apiOk } from "@/lib/totalia/crud"
import { prisma } from "@/lib/prisma"

export const GET = handle(async (req) => {
  const unitId = await requireUnitId()
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get("mes")
  const ano = searchParams.get("ano")

  const data = await prisma.barbershopRegraComissao.findMany({
    where: {
      unitId,
      ...(mes ? { mes: parseInt(mes) } : {}),
      ...(ano ? { ano: parseInt(ano) } : {}),
    },
    include: {
      colaborador: true,
      faixas: { orderBy: { faixaOrdem: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const { faixas, ...regraBody } = body
  const data = await prisma.barbershopRegraComissao.create({
    data: {
      unitId,
      tipo: regraBody.tipo ?? "geral",
      percentualFixo: regraBody.percentualFixo ? parseFloat(regraBody.percentualFixo) : null,
      usaEscalonamento: regraBody.usaEscalonamento ?? false,
      mes: parseInt(regraBody.mes),
      ano: parseInt(regraBody.ano),
      ...(regraBody.colaboradorId ? { colaboradorId: regraBody.colaboradorId } : {}),
      ...(faixas?.length
        ? {
            faixas: {
              create: faixas.map((f: any, i: number) => ({
                nome: f.nome,
                percentual: parseFloat(f.percentual),
                cor: f.cor ?? null,
                faixaOrdem: i,
              })),
            },
          }
        : {}),
    },
    include: { faixas: true },
  })
  return apiOk(data, 201)
})
