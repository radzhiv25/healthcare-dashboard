import { Link } from "react-router-dom"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  IconActivityHeartbeat,
  IconAlertTriangle,
  IconArrowNarrowUp,
  IconBed,
  IconBellRinging,
  IconCalendarEvent,
  IconClockHour4,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifyCriticalPatientAlert, notifyShiftSummary } from "@/lib/notifications"
import { usePatientStore } from "@/store/patient-store"

const admissionsData = [
  { day: "Mon", admissions: 28, discharges: 20, avgWaitMins: 22 },
  { day: "Tue", admissions: 31, discharges: 24, avgWaitMins: 19 },
  { day: "Wed", admissions: 26, discharges: 21, avgWaitMins: 24 },
  { day: "Thu", admissions: 35, discharges: 27, avgWaitMins: 18 },
  { day: "Fri", admissions: 39, discharges: 30, avgWaitMins: 16 },
  { day: "Sat", admissions: 23, discharges: 19, avgWaitMins: 21 },
  { day: "Sun", admissions: 20, discharges: 18, avgWaitMins: 20 },
]

const departmentOccupancy = [
  { name: "ICU", occupied: 34, available: 8 },
  { name: "Ward A", occupied: 58, available: 14 },
  { name: "Ward B", occupied: 49, available: 11 },
  { name: "ER", occupied: 26, available: 6 },
]

const payerMix = [
  { type: "Insurance", value: 58, fill: "var(--color-insurance)" },
  { type: "Corporate", value: 24, fill: "var(--color-corporate)" },
  { type: "Self Pay", value: 18, fill: "var(--color-selfPay)" },
]

const alerts = [
  { id: "ALT-021", patient: "Amelia Johnson", reason: "Cardiac anomaly detected", eta: "4m", severity: "Critical" },
  { id: "ALT-017", patient: "Noah Wilson", reason: "O2 saturation dropped below threshold", eta: "9m", severity: "High" },
  { id: "ALT-010", patient: "Sophia Davis", reason: "Medication confirmation pending", eta: "14m", severity: "Medium" },
]

const throughputRows = [
  { hour: "08:00", arrivals: 12, triaged: 10, avgWaitMins: 24 },
  { hour: "10:00", arrivals: 19, triaged: 16, avgWaitMins: 21 },
  { hour: "12:00", arrivals: 24, triaged: 22, avgWaitMins: 18 },
  { hour: "14:00", arrivals: 21, triaged: 20, avgWaitMins: 16 },
  { hour: "16:00", arrivals: 17, triaged: 15, avgWaitMins: 19 },
]

const qualitySignals = [
  { metric: "Hospital Acquired Infection", value: 1.8, target: 2.2 },
  { metric: "30-Day Readmission", value: 7.8, target: 8.5 },
  { metric: "Medication Compliance", value: 93, target: 90 },
  { metric: "Discharge Within 24h", value: 87, target: 84 },
]

const careTeamBoard = [
  { task: "ICU ventilator rounds", owner: "Dr. Kline", due: "13:30", priority: "High" },
  { task: "Medication reconciliation", owner: "Nurse Amy", due: "14:10", priority: "Medium" },
  { task: "Discharge education batch", owner: "Care Coord. Lee", due: "15:00", priority: "Low" },
  { task: "Critical case escalation review", owner: "Ops Lead", due: "15:20", priority: "High" },
]

const admissionsChartConfig = {
  admissions: { label: "Admissions", color: "var(--color-chart-1)" },
  discharges: { label: "Discharges", color: "var(--color-chart-2)" },
  avgWaitMins: { label: "Avg wait (mins)", color: "var(--color-chart-5)" },
} satisfies ChartConfig

const occupancyChartConfig = {
  occupied: { label: "Occupied beds", color: "var(--color-chart-3)" },
  available: { label: "Available beds", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const payerMixConfig = {
  insurance: { label: "Insurance", color: "var(--color-chart-1)" },
  corporate: { label: "Corporate", color: "var(--color-chart-2)" },
  selfPay: { label: "Self Pay", color: "var(--color-chart-4)" },
} satisfies ChartConfig

const qualitySignalsConfig = {
  value: { label: "Current", color: "var(--color-chart-1)" },
  target: { label: "Target", color: "var(--color-chart-2)" },
} satisfies ChartConfig

export function HomeDashboardPage() {
  const patients = usePatientStore((state) => state.patients)
  const criticalCount = patients.filter((patient) => patient.status === "Critical").length
  const occupancyRate = Math.round(
    (departmentOccupancy.reduce((total, item) => total + item.occupied, 0) / 190) * 100
  )

  return (
    <div className="space-y-4 md:space-y-5">
      <header className="space-y-1">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold sm:text-2xl">Clinical Operations Dashboard</h1>
          <Badge variant="secondary" className="h-6 px-2.5 text-[0.65rem] tracking-wide uppercase">
            Live Ops
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Track intake, capacity, patient risk, and operational efficiency from a single command center.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconUsers className="size-4" />
              Active Patients
            </CardDescription>
            <CardTitle className="text-3xl">{patients.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">Updated from patient module state</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconAlertTriangle className="size-4" />
              Critical Cases
            </CardDescription>
            <CardTitle className="text-3xl text-destructive">{criticalCount}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">Requires intervention within 10 mins</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconBed className="size-4" />
              Bed Occupancy
            </CardDescription>
            <CardTitle className="text-3xl">{occupancyRate}%</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">167 occupied out of 190 total beds</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <IconCalendarEvent className="size-4" />
              Appointments Today
            </CardDescription>
            <CardTitle className="text-3xl">128</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">+12% compared to yesterday</CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col items-start justify-between gap-2 pb-2 sm:flex-row sm:gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconActivityHeartbeat className="size-5 text-primary" />
                Patient Flow Trends
              </CardTitle>
              <CardDescription>Admissions, discharges, and average wait time trends</CardDescription>
            </div>
            <Badge variant="outline" className="h-6 px-2.5">
              <IconArrowNarrowUp className="size-3.5" /> 8.2% week-over-week
            </Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="volume" className="gap-3">
              <TabsList variant="line" className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="wait-time">Wait Time</TabsTrigger>
              </TabsList>

              <TabsContent value="volume">
                <ChartContainer config={admissionsChartConfig} className="h-64 w-full sm:h-72">
                  <AreaChart data={admissionsData}>
                    <defs>
                      <linearGradient id="admissionsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-admissions)" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="var(--color-admissions)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="admissions"
                      stroke="var(--color-admissions)"
                      fill="url(#admissionsFill)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="discharges"
                      stroke="var(--color-discharges)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="wait-time">
                <ChartContainer config={admissionsChartConfig} className="h-64 w-full sm:h-72">
                  <BarChart data={admissionsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgWaitMins" fill="var(--color-avgWaitMins)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconStethoscope className="size-5 text-primary" />
              Revenue Mix
            </CardTitle>
            <CardDescription>Payer distribution for current billing cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer config={payerMixConfig} className="h-52 w-full sm:h-56">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
                <Pie data={payerMix} dataKey="value" nameKey="type" innerRadius={54} outerRadius={82}>
                  {payerMix.map((entry) => (
                    <Cell key={entry.type} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 text-xs">
              {payerMix.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.type}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Clinical Quality Signals</CardTitle>
            <CardDescription>Outcome indicators against benchmark targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={qualitySignalsConfig} className="h-64 w-full">
              <BarChart data={qualitySignals} margin={{ left: 16, right: 16 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="metric" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="target" fill="var(--color-target)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Care Team Board</CardTitle>
            <CardDescription>Live shift tasks and accountability queue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {careTeamBoard.map((item) => (
              <article key={item.task} className="rounded-md border bg-muted/20 p-2.5 text-xs">
                <p className="font-medium">{item.task}</p>
                <div className="mt-1 flex items-center justify-between text-muted-foreground">
                  <span>{item.owner}</span>
                  <span>{item.due}</span>
                </div>
                <div className="mt-2">
                  <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"}>
                    {item.priority}
                  </Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Department Occupancy</CardTitle>
            <CardDescription>Occupied vs available beds by department with clear legend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occupancyChartConfig} className="h-60 w-full sm:h-64">
              <BarChart data={departmentOccupancy} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={56} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[6, 0, 0, 6]} stackId="beds" />
                <Bar dataKey="available" fill="var(--color-available)" radius={[0, 6, 6, 0]} stackId="beds" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Critical Alert Queue</CardTitle>
            <CardDescription>Escalations sorted by urgency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <article key={alert.id} className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {alert.patient} <span className="font-normal text-muted-foreground">({alert.id})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{alert.reason}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={alert.severity === "Critical" ? "destructive" : "secondary"}>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className="h-6">
                    <IconClockHour4 className="size-3.5" /> {alert.eta}
                  </Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Hourly Throughput</CardTitle>
            <CardDescription>Arrivals, triage completion, and wait benchmark</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-120 text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="rounded-l-md px-3 py-2 font-medium">Hour</th>
                  <th className="px-3 py-2 font-medium">Arrivals</th>
                  <th className="px-3 py-2 font-medium">Triaged</th>
                  <th className="rounded-r-md px-3 py-2 font-medium">Avg Wait</th>
                </tr>
              </thead>
              <tbody>
                {throughputRows.map((row) => (
                  <tr key={row.hour} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.hour}</td>
                    <td className="px-3 py-2">{row.arrivals}</td>
                    <td className="px-3 py-2">{row.triaged}</td>
                    <td className="px-3 py-2">{row.avgWaitMins} mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump directly into core modules</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <Button asChild className="justify-start">
              <Link to="/patients">Open Patient Details</Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link to="/analytics">Open Analytics</Link>
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              Create Appointment (coming soon)
            </Button>
            <Button variant="outline" className="justify-start" disabled>
              Assign Bed (coming soon)
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBellRinging className="size-5 text-primary" />
              Notification Runbook
            </CardTitle>
            <CardDescription>Validate browser notifications and handoff paths for operations alerts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <article className="rounded-md border bg-muted/20 p-3">
              <p className="text-sm font-medium">Critical care escalation</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sends a high-priority alert and deep-links the user to patient operations.
              </p>
              <Button
                className="mt-3 w-full"
                size="sm"
                onClick={() =>
                  void notifyCriticalPatientAlert("Amelia Johnson", "Cardiac anomaly requires immediate review")
                }
              >
                Send critical alert
              </Button>
            </article>
            <article className="rounded-md border bg-muted/20 p-3">
              <p className="text-sm font-medium">Shift closure summary</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Triggers a post-shift summary that routes directly to analytics insights.
              </p>
              <Button className="mt-3 w-full" size="sm" variant="secondary" onClick={() => void notifyShiftSummary()}>
                Send shift summary
              </Button>
            </article>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Events</CardTitle>
            <CardDescription>Recent in-app operational events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="rounded-md border p-2">
              <p className="font-medium">01:18 AM - Login success prompt</p>
              <p className="text-muted-foreground">User session initiated for operations console.</p>
            </div>
            <div className="rounded-md border p-2">
              <p className="font-medium">01:21 AM - Triage threshold warning</p>
              <p className="text-muted-foreground">ER wait-time exceeded 20-minute threshold.</p>
            </div>
            <div className="rounded-md border p-2">
              <p className="font-medium">01:24 AM - Billing cycle summary</p>
              <p className="text-muted-foreground">Collection efficiency report generated.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
