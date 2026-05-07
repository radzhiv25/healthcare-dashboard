import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useEffect, useState } from "react"
import { TbHealthRecognition } from "react-icons/tb"
import { ThemeToggle } from "@/components/theme-toggle"

type SummaryMetric = {
  label: string
  value: number
  tone: string
}

type OverlayMetric = {
  label: string
  value: number
  suffix?: string
  decimals?: number
  valueClassName?: string
}

const monthlyData = [
  { month: "Jan", consultations: 18, discharges: 10, capacity: 30 },
  { month: "Feb", consultations: 24, discharges: 12, capacity: 30 },
  { month: "Mar", consultations: 22, discharges: 11, capacity: 32 },
  { month: "Apr", consultations: 35, discharges: 16, capacity: 34 },
  { month: "May", consultations: 42, discharges: 18, capacity: 38 },
  { month: "Jun", consultations: 38, discharges: 15, capacity: 38 },
  { month: "Jul", consultations: 36, discharges: 14, capacity: 40 },
  { month: "Aug", consultations: 40, discharges: 16, capacity: 42 },
  { month: "Sep", consultations: 46, discharges: 19, capacity: 44 },
  { month: "Oct", consultations: 51, discharges: 21, capacity: 46 },
  { month: "Nov", consultations: 48, discharges: 20, capacity: 46 },
  { month: "Dec", consultations: 55, discharges: 22, capacity: 50 },
]

const donutData = [
  { name: "Critical", value: 22, fill: "#5c88ff" },
  { name: "Stable", value: 53, fill: "#9bb8ff" },
  { name: "Observation", value: 25, fill: "#d5e3ff" },
]

const overlayMetrics: OverlayMetric[] = [
  { label: "Facilities", value: 12, suffix: " Centers" },
  { label: "Live Patients", value: 2847 },
  { label: "Response SLA", value: 98.2, decimals: 1, suffix: "%", valueClassName: "text-emerald-700" },
]

const summaryMetrics: SummaryMetric[] = [
  { label: "Total Patients", value: 2847, tone: "#4f8ff7" },
  { label: "Critical Cases", value: 43, tone: "#eb7c7c" },
  { label: "Pending Labs", value: 14, tone: "#f2c153" },
  { label: "New Admissions", value: 28, tone: "#6f88ff" },
]

function AnimatedMetric({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const durationMs = 3000
    const start = performance.now()
    let frame = 0

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 2)
      setDisplayValue(value * eased)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

function HeroOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-sm flex-col items-center justify-center space-y-5">
      <div className="space-y-4 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          <TbHealthRecognition className="size-5" />
          Med Inc. Platform
        </p>
        <h3 className="mt-1 text-left text-2xl font-semibold text-foreground">
          Unified Medical Operations Dashboard
        </h3>
        <p className="mt-1 text-left text-sm text-muted-foreground">
          Track patient volume, critical alerts, and care-delivery performance in real time.
        </p>
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {overlayMetrics.map((metric) => (
          <div
            key={metric.label}
            className="lyra-corners border border-border/80 bg-card/80 px-3 py-2 shadow-sm backdrop-blur-xs"
          >
            <p className="text-[11px] text-muted-foreground">{metric.label}</p>
            <p className={`text-sm font-semibold text-foreground ${metric.valueClassName ?? ""}`}>
              <AnimatedMetric
                value={metric.value}
                decimals={metric.decimals ?? 0}
                suffix={metric.suffix ?? ""}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopLeftBranding() {
  return (
    <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between">
      <div className="flex items-center gap-2">
      <TbHealthRecognition className="size-5 text-foreground/80" />
      <span className="text-sm font-semibold tracking-wide text-foreground/80">Med Inc.</span>
      </div>
      <ThemeToggle />
    </div>
  )
}

function PreviewNav() {
  return (
    <div className="lyra-corners mb-4 flex items-center justify-between border border-border/70 bg-card/65 px-4 py-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <TbHealthRecognition className="size-5" />
        <span className="text-sm font-semibold text-foreground/80">Med Inc.</span>
      </div>
      <div className="hidden items-center gap-4 text-[11px] text-muted-foreground lg:flex">
        <span className="text-foreground/80">Dashboard</span>
        <span>Policies</span>
        <span>Claims</span>
        <span>Clients</span>
        <span>Agents</span>
      </div>
      <div className="h-6 w-24 bg-muted/70" />
    </div>
  )
}

function SummaryMetricGrid() {
  return (
    <div className="mb-4 grid grid-cols-4 gap-3">
      {summaryMetrics.map((tile) => (
        <div
          key={tile.label}
          className="lyra-corners border border-border/70 bg-card/65 p-2.5 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
        >
          <p className="text-[10px] text-muted-foreground">{tile.label}</p>
          <p className="mb-2 text-sm font-semibold text-foreground/80">
            <AnimatedMetric value={tile.value} />
          </p>
          <div className="h-1.5 w-full bg-muted/70">
            <div
              className="h-1.5 transition-all duration-700"
              style={{ width: "70%", backgroundColor: tile.tone }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ConsultationsChartCard() {
  return (
    <div className="lyra-corners col-span-3 border border-border/70 bg-card/65 p-3 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground/80">Patient Consultations</p>
          <p className="text-[11px] text-muted-foreground">Monthly OPD and discharge trends</p>
        </div>
        <div className="text-[11px] text-muted-foreground">
          <span className="mr-3 inline-block size-2 bg-sky-500" />
          Consultations
          <span className="ml-4 mr-3 inline-block size-2 bg-indigo-300" />
          Discharges
          <span className="ml-4 mr-3 inline-block size-2 border border-amber-400 bg-transparent" />
          Capacity
        </div>
      </div>
      <div className="lyra-corners h-36 bg-muted/35 p-2 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.25)" }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value, name) => {
                const numericValue =
                  typeof value === "number"
                    ? value
                    : Number.parseFloat(String(value ?? 0))
                const label =
                  name === "consultations"
                    ? "Consultations"
                    : name === "discharges"
                      ? "Discharges"
                      : "Capacity"

                return [`${numericValue} patients`, label]
              }}
              contentStyle={{
                background: "hsl(var(--popover) / 0.95)",
                border: "1px solid hsl(var(--border))",
                borderRadius: 0,
                color: "hsl(var(--popover-foreground))",
                fontSize: 12,
              }}
            />
            <Bar dataKey="discharges" radius={0} fill="hsl(var(--chart-2))" animationDuration={900} />
            <Bar
              dataKey="consultations"
              radius={0}
              fill="hsl(var(--chart-1))"
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="capacity"
              stroke="hsl(var(--chart-4))"
              strokeWidth={1.75}
              strokeDasharray="4 4"
              dot={false}
              animationDuration={1100}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function WardStatusCard() {
  return (
    <div className="lyra-corners border border-border/70 bg-card/65 p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <p className="mb-2 text-xs font-medium text-foreground/80">Ward Status Mix</p>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              innerRadius={26}
              outerRadius={42}
              paddingAngle={3}
              animationDuration={1400}
            >
              {donutData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5 text-[10px]">
        {donutData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              {entry.name}
            </span>
            <span className="font-medium text-foreground/80">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="lyra-corners relative top-100 left-40 w-full max-w-3xl animate-in slide-in-from-right-4 duration-700 border border-border/70 bg-card/35 p-3 shadow-[0_24px_60px_-30px_rgba(13,38,76,0.35)] backdrop-blur-md">
      <div className="lyra-corners border border-border/60 bg-card/55 p-4 shadow-sm backdrop-blur-xl transition-transform duration-500">
        <PreviewNav />

        <div className="mb-4">
          <p className="text-xl font-semibold text-foreground">Good Morning, Mr. Richard</p>
          <p className="text-xs text-muted-foreground">
            Med Inc Central Care Dashboard - Monday 12 February 2025
          </p>
        </div>

        <SummaryMetricGrid />

        <div className="grid grid-cols-4 gap-3">
          <ConsultationsChartCard />
          <WardStatusCard />
        </div>
      </div>
    </div>
  )
}

export function AuthBrandPanel() {
  return (
    <section className="relative hidden min-h-svh overflow-hidden border-l border-border bg-background p-10 md:flex md:items-center md:justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--card))_0%,transparent_35%),radial-gradient(circle_at_80%_70%,hsl(var(--muted))_0%,transparent_45%)] opacity-40" />
      <HeroOverlay />
      <TopLeftBranding />
      <DashboardPreview />
    </section>
  )
}
