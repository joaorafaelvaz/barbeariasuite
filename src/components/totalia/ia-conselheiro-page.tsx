"use client"

import { useState, useRef, useEffect } from "react"
import { useAdvisorConversations, useFetch } from "@/lib/totalia"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Plus, Trash2 } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
  createdAt?: string
}

export default function IAConselheiroPage() {
  const { conversations, loading, createConversation, updateConversation, deleteConversation } = useAdvisorConversations()
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const { data: activeConv, refetch: refetchConv } = useFetch<any>(
    activeConvId ? `/api/totalia/advisor/conversations/${activeConvId}` : ""
  )
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages: Message[] = activeConv?.messages ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleNewConversation = async () => {
    const conv = await createConversation({ title: "Nova conversa" })
    setActiveConvId(conv.id)
  }

  const handleSend = async () => {
    if (!input.trim() || !activeConvId) return
    const userMsg: Message = { role: "user", content: input.trim(), createdAt: new Date().toISOString() }
    const newMessages = [...messages, userMsg]
    setInput("")
    setSending(true)

    try {
      // Save user message immediately
      await updateConversation(activeConvId, { messages: newMessages })
      refetchConv()

      // Simple echo response for now (can be replaced with AI API call)
      const assistantMsg: Message = {
        role: "assistant",
        content: `Recebi sua mensagem: "${userMsg.content}". Esta funcionalidade será integrada com uma API de IA em breve.`,
        createdAt: new Date().toISOString(),
      }
      const finalMessages = [...newMessages, assistantMsg]
      await updateConversation(activeConvId, { messages: finalMessages })
      refetchConv()
    } catch {
      toast.error("Erro ao enviar mensagem.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <Button onClick={handleNewConversation} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
        <div className="overflow-y-auto space-y-1">
          {loading ? (
            <p className="text-sm text-muted-foreground p-2">Carregando...</p>
          ) : (
            conversations.map((c: any) => (
              <div
                key={c.id}
                className={`flex items-center justify-between rounded-md px-3 py-2 cursor-pointer text-sm ${
                  activeConvId === c.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => setActiveConvId(c.id)}
              >
                <span className="truncate">{c.title ?? "Conversa"}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(c.id)
                    if (activeConvId === c.id) setActiveConvId(null)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Selecione uma conversa ou inicie uma nova</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground">
                    Digitando...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                disabled={sending}
              />
              <Button onClick={handleSend} disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
