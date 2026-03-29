import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const GET = handle(async () => {
  const unitId = await requireUnitId()
  const data = await prisma.totaliaMarketingCampaign.findMany({
    where: { unitId },
    orderBy: { createdAt: "desc" },
  })
  return apiOk(data)
})

export const POST = handle(async (req: NextRequest) => {
  const unitId = await requireUnitId()
  const body = await req.json()
  const data = await prisma.totaliaMarketingCampaign.create({
    data: {
      unitId,
      campaignName: body.campaign_name,
      status: body.status ?? "rascunho",
      inputs: body.inputs,
      outputs: body.outputs,
      wizardResponses: body.wizard_responses,
      budgetSplit: body.budget_split,
      channelMix: body.channel_mix,
      personas: body.personas,
      adsKits: body.ads_kits,
      landingCopy: body.landing_copy,
      assumptions: body.assumptions,
      kpisTargets: body.kpis_targets,
      calendar90d: body.calendar_90d,
      crmFlows: body.crm_flows,
      executiveSummary: body.executive_summary,
      messages: body.messages,
    },
  })
  return apiOk(data, 201)
})
