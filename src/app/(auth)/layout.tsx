export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.08_0.008_265)] p-4">
      {/* Glow radial no topo */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[radial-gradient(ellipse,oklch(0.76_0.14_78/0.07)_0%,transparent_70%)]" />
      {/* Grade de pontos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.76 0.14 78 / 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  )
}
