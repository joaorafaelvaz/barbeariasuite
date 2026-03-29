import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const { searchParams } = req.nextUrl
  const status = searchParams.get("status")

  const data = await prisma.totaliaTask.findMany({
    where: {
      unitId,
      ...(status ? { status } : {}),
    },
    include: { responsavel: { select: { id: true, nome: true } } },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaTask.create({
    data: {
      unitId,
      titulo: body.titulo,
      descricao: body.descricao,
      area: body.area,
      prioridade: body.prioridade,
      status: body.status ?? "A Fazer",
      dueDate: body.due_date ? new Date(body.due_date) : null,
      estimativaHoras: body.estimativa_horas,
      processoRelacionado: body.processo_relacionado,
      responsavelId: body.responsavel_id,
      participantes: body.participantes ?? [],
      dependsOn: body.depends_on ?? [],
      checklist: body.checklist ?? [],
      criteriosAceite: body.criterios_aceite ?? [],
      evidenciasRequeridas: body.evidencias_requeridas ?? [],
      relacaoObjetivos: body.relacao_objetivos ?? [],
      valoresAderentes: body.valores_aderentes ?? [],
      riscosMitigados: body.riscos_mitigados ?? [],
      notasExecucao: body.notas_execucao,
      plano: body.plano,
      recorrencia: body.recorrencia,
    },
  })
  return apiOk(data, 201)
})
