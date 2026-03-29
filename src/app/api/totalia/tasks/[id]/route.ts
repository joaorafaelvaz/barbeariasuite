import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaTask.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descricao: body.descricao,
      area: body.area,
      prioridade: body.prioridade,
      status: body.status,
      dueDate: body.due_date ? new Date(body.due_date) : undefined,
      estimativaHoras: body.estimativa_horas,
      processoRelacionado: body.processo_relacionado,
      responsavelId: body.responsavel_id,
      participantes: body.participantes,
      dependsOn: body.depends_on,
      checklist: body.checklist,
      criteriosAceite: body.criterios_aceite,
      evidenciasRequeridas: body.evidencias_requeridas,
      relacaoObjetivos: body.relacao_objetivos,
      valoresAderentes: body.valores_aderentes,
      riscosMitigados: body.riscos_mitigados,
      notasExecucao: body.notas_execucao,
      plano: body.plano,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaTask.delete({ where: { id } })
  return apiOk({ success: true })
})
