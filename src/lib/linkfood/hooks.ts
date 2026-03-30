"use client"

import { useCallback } from "react"
import { useFetch, apiPost, apiPut, apiDelete } from "@/lib/totalia/use-fetch"
import { toast } from "sonner"

export function useBusinesses() {
  const { data, loading, refetch } = useFetch<any[]>("/api/linkfood/businesses")
  const businesses = data ?? []

  const createBusiness = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/linkfood/businesses", body)
      toast.success("Estabelecimento adicionado.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateBusiness = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/linkfood/businesses/${id}`, body)
      toast.success("Estabelecimento atualizado.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteBusiness = useCallback(
    async (id: string) => {
      await apiDelete(`/api/linkfood/businesses/${id}`)
      toast.success("Estabelecimento removido.")
      refetch()
    },
    [refetch]
  )

  return { businesses, loading, createBusiness, updateBusiness, deleteBusiness, refetch }
}

export function useReviews(params?: {
  businessId?: string
  platform?: string
  sentiment?: string
  page?: number
}) {
  const qs = new URLSearchParams()
  if (params?.businessId) qs.set("businessId", params.businessId)
  if (params?.platform) qs.set("platform", params.platform)
  if (params?.sentiment) qs.set("sentiment", params.sentiment)
  if (params?.page) qs.set("page", String(params.page))
  const url = `/api/linkfood/reviews${qs.toString() ? "?" + qs : ""}`

  const { data, loading, refetch } = useFetch<any>(url)
  const reviews = data?.reviews ?? []
  const total = data?.total ?? 0

  const createReview = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/linkfood/reviews", body)
      toast.success("Avaliação adicionada.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteReview = useCallback(
    async (id: string) => {
      await apiDelete(`/api/linkfood/reviews/${id}`)
      toast.success("Avaliação removida.")
      refetch()
    },
    [refetch]
  )

  return { reviews, total, loading, createReview, deleteReview, refetch }
}

export function useIntegrations() {
  const { data, loading, refetch } = useFetch<any[]>("/api/linkfood/integrations")
  const integrations = data ?? []

  const saveIntegration = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/linkfood/integrations", body)
      toast.success("Integração salva.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteIntegration = useCallback(
    async (id: string) => {
      await apiDelete(`/api/linkfood/integrations/${id}`)
      toast.success("Integração removida.")
      refetch()
    },
    [refetch]
  )

  return { integrations, loading, saveIntegration, deleteIntegration, refetch }
}

export function useChecklists() {
  const { data, loading, refetch } = useFetch<any[]>("/api/linkfood/checklists")
  const checklists = data ?? []

  const createChecklist = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/linkfood/checklists", body)
      toast.success("Checklist criado.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateChecklist = useCallback(
    async (id: string, body: any) => {
      const result = await apiPut(`/api/linkfood/checklists/${id}`, body)
      toast.success("Checklist atualizado.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteChecklist = useCallback(
    async (id: string) => {
      await apiDelete(`/api/linkfood/checklists/${id}`)
      toast.success("Checklist removido.")
      refetch()
    },
    [refetch]
  )

  const completeItems = useCallback(
    async (checklistId: string, itemIds: string[], periodDate?: string) => {
      await apiPost(`/api/linkfood/checklists/${checklistId}/complete`, {
        itemIds,
        periodDate,
      })
      toast.success("Itens marcados como concluídos.")
      refetch()
    },
    [refetch]
  )

  return { checklists, loading, createChecklist, updateChecklist, deleteChecklist, completeItems }
}

export function useLinkfoodDashboard() {
  return useFetch<any>("/api/linkfood/dashboard")
}
