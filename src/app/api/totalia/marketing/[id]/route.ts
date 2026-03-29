import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireUnitId, apiOk, handle } from "@/lib/totalia/crud"

export const PUT = handle(async (req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  const body = await req.json()
  const data = await prisma.totaliaMarketingCampaign.update({
    where: { id },
    data: {
      campaignName: body.campaign_name,
      status: body.status,
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
      pdfUrl: body.pdf_url,
    },
  })
  return apiOk(data)
})

export const DELETE = handle(async (_req: NextRequest, ctx) => {
  await requireUnitId()
  const { id } = await ctx!.params
  await prisma.totaliaMarketingCampaign.delete({ where: { id } })
  return apiOk({ success: true })
})
