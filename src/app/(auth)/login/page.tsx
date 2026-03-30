"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Scissors, ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      setError("Email ou senha incorretos")
      setLoading(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[oklch(0.76_0.14_78/0.12)] ring-1 ring-[oklch(0.76_0.14_78/0.35)]">
          <Scissors className="h-7 w-7 text-[oklch(0.76_0.14_78)]" />
        </div>
        <div className="text-center">
          <h1
            className="text-3xl font-light italic tracking-tight text-[oklch(0.76_0.14_78)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BarbeariaSuite
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Gestão de Franquias
          </p>
        </div>
      </div>

      {/* Login card */}
      <div className="w-full rounded-2xl border border-border bg-card p-7 shadow-2xl shadow-black/50">
        <h2 className="mb-6 text-base font-semibold text-foreground">
          Entre na sua conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-[oklch(0.10_0.008_265)] border-border placeholder:text-muted-foreground/40 focus-visible:ring-[oklch(0.76_0.14_78/0.4)] focus-visible:border-[oklch(0.76_0.14_78/0.6)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-[oklch(0.10_0.008_265)] border-border placeholder:text-muted-foreground/40 focus-visible:ring-[oklch(0.76_0.14_78/0.4)] focus-visible:border-[oklch(0.76_0.14_78/0.6)]"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-[oklch(0.76_0.14_78)] text-[oklch(0.09_0.008_265)] font-semibold hover:bg-[oklch(0.82_0.13_78)] transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Entrar <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[11px] text-muted-foreground">
              ou continue com
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="h-11 w-full border-border bg-transparent hover:bg-[oklch(0.76_0.14_78/0.06)] hover:border-[oklch(0.76_0.14_78/0.4)] transition-colors"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <a
            href="/register"
            className="text-[oklch(0.76_0.14_78)] hover:underline underline-offset-4"
          >
            Criar conta
          </a>
        </p>
      </div>
    </div>
  )
}
