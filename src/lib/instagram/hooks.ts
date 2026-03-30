"use client"

import { useCallback } from "react"
import { useFetch, apiPost, apiPut, apiDelete } from "@/lib/totalia/use-fetch"
import { toast } from "sonner"

export function useIgAccounts() {
  const { data, loading, refetch } = useFetch<any[]>("/api/instagram/accounts")
  const accounts = data ?? []

  const createAccount = useCallback(
    async (name: string) => {
      const result = await apiPost("/api/instagram/accounts", { name })
      toast.success("Conta adicionada.")
      refetch()
      return result
    },
    [refetch]
  )

  const deleteAccount = useCallback(
    async (id: string) => {
      await apiDelete(`/api/instagram/accounts/${id}`)
      toast.success("Conta removida.")
      refetch()
    },
    [refetch]
  )

  return { accounts, loading, createAccount, deleteAccount, refetch }
}

export function useIgConfig(accountId: string) {
  const url = accountId ? `/api/instagram/config?accountId=${accountId}` : ""
  const { data, loading, refetch } = useFetch<any>(url)

  const saveConfig = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/instagram/config", { accountId, ...body })
      toast.success("Configuração salva.")
      refetch()
      return result
    },
    [accountId, refetch]
  )

  return { config: data, loading, saveConfig, refetch }
}

export function useIgLogs(params?: { accountId?: string; type?: string; page?: number }) {
  const qs = new URLSearchParams()
  if (params?.accountId) qs.set("accountId", params.accountId)
  if (params?.type) qs.set("type", params.type)
  if (params?.page) qs.set("page", String(params.page))
  const { data, loading, refetch } = useFetch<any>(`/api/instagram/logs?${qs}`)
  return {
    logs: data?.logs ?? [],
    total: data?.total ?? 0,
    loading,
    refetch,
  }
}

export function useIgStats(accountId?: string, days = 30) {
  const qs = new URLSearchParams({ days: String(days) })
  if (accountId) qs.set("accountId", accountId)
  const { data, loading } = useFetch<any>(`/api/instagram/stats?${qs}`)
  return { stats: data?.stats ?? [], totals: data?.totals, loading }
}

export function useAprovacoes(params?: { accountId?: string; status?: string }) {
  const qs = new URLSearchParams()
  if (params?.accountId) qs.set("accountId", params.accountId)
  if (params?.status) qs.set("status", params.status)
  const { data, loading, refetch } = useFetch<any[]>(`/api/instagram/aprovacoes?${qs}`)
  const aprovacoes = data ?? []

  const updateAprovacao = useCallback(
    async (id: string, action: "approve" | "reject", suggestedReply?: string) => {
      await apiPut(`/api/instagram/aprovacoes/${id}`, { action, suggestedReply })
      toast.success(action === "approve" ? "Aprovado." : "Rejeitado.")
      refetch()
    },
    [refetch]
  )

  return { aprovacoes, loading, updateAprovacao, refetch }
}

export function useBemVindos(params?: { accountId?: string; status?: string }) {
  const qs = new URLSearchParams()
  if (params?.accountId) qs.set("accountId", params.accountId)
  if (params?.status) qs.set("status", params.status)
  const { data, loading, refetch } = useFetch<any[]>(`/api/instagram/bem-vindos?${qs}`)
  const mensagens = data ?? []

  const updateStatus = useCallback(
    async (id: string, status: "sent" | "dismissed") => {
      await apiPut(`/api/instagram/bem-vindos/${id}`, { status })
      toast.success(status === "sent" ? "Marcado como enviado." : "Descartado.")
      refetch()
    },
    [refetch]
  )

  return { mensagens, loading, updateStatus, refetch }
}

export function useMonitoramento(accountId?: string) {
  const qs = accountId ? `?accountId=${accountId}` : ""
  const { data, loading, refetch } = useFetch<any[]>(`/api/instagram/monitoramento${qs}`)
  const watchAccounts = data ?? []

  const addWatch = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/instagram/monitoramento", body)
      toast.success("Conta adicionada ao monitoramento.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateWatch = useCallback(
    async (id: string, body: any) => {
      await apiPut(`/api/instagram/monitoramento/${id}`, body)
      refetch()
    },
    [refetch]
  )

  const removeWatch = useCallback(
    async (id: string) => {
      await apiDelete(`/api/instagram/monitoramento/${id}`)
      toast.success("Removido do monitoramento.")
      refetch()
    },
    [refetch]
  )

  return { watchAccounts, loading, addWatch, updateWatch, removeWatch }
}

export function useVariants() {
  const { data, loading, refetch } = useFetch<any[]>("/api/instagram/variants")
  const variants = data ?? []

  const createVariant = useCallback(
    async (body: any) => {
      const result = await apiPost("/api/instagram/variants", body)
      toast.success("Variante criada.")
      refetch()
      return result
    },
    [refetch]
  )

  const updateVariant = useCallback(
    async (id: string, body: any) => {
      await apiPut(`/api/instagram/variants/${id}`, body)
      refetch()
    },
    [refetch]
  )

  const deleteVariant = useCallback(
    async (id: string) => {
      await apiDelete(`/api/instagram/variants/${id}`)
      toast.success("Variante removida.")
      refetch()
    },
    [refetch]
  )

  return { variants, loading, createVariant, updateVariant, deleteVariant }
}
