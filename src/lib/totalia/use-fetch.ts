"use client"

import { useState, useEffect, useCallback } from "react"

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

/** Generic hook to fetch data from a URL and refresh on demand */
export function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null })

  const load = useCallback(async () => {
    if (!url) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setState({ data, loading: false, error: null })
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message })
    }
  }, [url])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, refetch: load }
}

/** POST/PUT/DELETE helpers */
export async function apiPost(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPut(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiDelete(url: string) {
  const res = await fetch(url, { method: "DELETE" })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
