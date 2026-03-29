"use client"

import { useMeetings } from "@/lib/totalia/hooks"
import { Calendar } from "lucide-react"
import { SimpleListPage } from "./simple-list-page"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "description", label: "Descrição", type: "textarea" as const },
  { key: "meeting_date", label: "Data", type: "date" as const, required: true },
  { key: "meeting_time", label: "Horário" },
  { key: "location", label: "Local" },
  { key: "meeting_type", label: "Tipo", type: "select" as const, options: ["Reunião", "Workshop", "Treinamento", "1:1", "Review", "Outro"] },
]

export default function ReunioesPage() {
  const { meetings, loading, createMeeting, updateMeeting, deleteMeeting } = useMeetings()

  return (
    <SimpleListPage
      title="Reuniões"
      description="Agenda e registro de reuniões"
      icon={<Calendar className="h-5 w-5" />}
      items={meetings}
      loading={loading}
      fields={fields}
      onAdd={createMeeting}
      onUpdate={updateMeeting}
      onDelete={deleteMeeting}
      itemToForm={(item) => ({
        title: item.title,
        description: item.description ?? "",
        meeting_date: item.meetingDate ? item.meetingDate.split("T")[0] : "",
        meeting_time: item.meetingTime ?? "",
        location: item.location ?? "",
        meeting_type: item.meetingType ?? "",
      })}
      displayFields={(item) => (
        <div className="space-y-1">
          <p className="font-medium">{item.title}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{format(new Date(item.meetingDate), "dd/MM/yyyy", { locale: ptBR })}</span>
            {item.meetingTime && <span>{item.meetingTime}</span>}
            {item.location && <span>📍 {item.location}</span>}
            {item.meetingType && <span>{item.meetingType}</span>}
          </div>
        </div>
      )}
    />
  )
}
