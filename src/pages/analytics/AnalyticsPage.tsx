import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { IconArrowNarrowUp, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
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

const weeklyVolumeData = [
  { day: "Mon", visits: 120, admissions: 26, discharges: 18 },
  { day: "Tue", visits: 132, admissions: 31, discharges: 21 },
  { day: "Wed", visits: 118, admissions: 24, discharges: 19 },
  { day: "Thu", visits: 149, admissions: 33, discharges: 25 },
  { day: "Fri", visits: 161, admissions: 38, discharges: 29 },
  { day: "Sat", visits: 104, admissions: 21, discharges: 17 },
  { day: "Sun", visits: 98, admissions: 19, discharges: 16 },
]

const qualityKpiData = [
  { week: "W1", satisfaction: 89, readmissionRate: 9.4 },
  { week: "W2", satisfaction: 91, readmissionRate: 8.7 },
  { week: "W3", satisfaction: 93, readmissionRate: 8.1 },
  { week: "W4", satisfaction: 92, readmissionRate: 7.8 },
]

const departmentLoadData = [
  { department: "ICU", occupancy: 88, avgWait: 16 },
  { department: "ER", occupancy: 82, avgWait: 21 },
  { department: "Cardiology", occupancy: 74, avgWait: 14 },
  { department: "Neurology", occupancy: 69, avgWait: 18 },
  { department: "Orthopedics", occupancy: 63, avgWait: 12 },
]

const claimStatusData = [
  { name: "Approved", value: 62, fill: "var(--color-approved)" },
  { name: "Pending", value: 26, fill: "var(--color-pending)" },
  { name: "Denied", value: 12, fill: "var(--color-denied)" },
]

const monthlyRevenueData = [
  { month: "Jan", billed: 1.3, collected: 1.08 },
  { month: "Feb", billed: 1.48, collected: 1.22 },
  { month: "Mar", billed: 1.62, collected: 1.37 },
  { month: "Apr", billed: 1.56, collected: 1.33 },
  { month: "May", billed: 1.74, collected: 1.49 },
  { month: "Jun", billed: 1.81, collected: 1.56 },
]

const lengthOfStayData = [
  { cohort: "Cardiology", los: 4.1, target: 4.5 },
  { cohort: "Neurology", los: 5.3, target: 5.8 },
  { cohort: "Orthopedics", los: 3.8, target: 4.2 },
  { cohort: "Pulmonology", los: 4.6, target: 4.9 },
]

const caseMixData = [
  { diagnosis: "Cardiac", count: 86 },
  { diagnosis: "Respiratory", count: 74 },
  { diagnosis: "Neurology", count: 62 },
  { diagnosis: "Endocrine", count: 51 },
  { diagnosis: "Oncology", count: 43 },
]

const volumeChartConfig = {
  visits: { label: "Visits", color: "var(--color-chart-1)" },
  admissions: { label: "Admissions", color: "var(--color-chart-2)" },
  discharges: { label: "Discharges", color: "var(--color-chart-3)" },
} satisfies ChartConfig

const qualityChartConfig = {
  satisfaction: { label: "Satisfaction", color: "var(--color-chart-1)" },
  readmissionRate: { label: "Readmission %", color: "var(--color-chart-5)" },
} satisfies ChartConfig

const departmentChartConfig = {
  occupancy: { label: "Occupancy %", color: "var(--color-chart-3)" },
  avgWait: { label: "Avg Wait (mins)", color: "var(--color-chart-4)" },
} satisfies ChartConfig

const claimChartConfig = {
  approved: { label: "Approved", color: "var(--color-chart-1)" },
  pending: { label: "Pending", color: "var(--color-chart-2)" },
  denied: { label: "Denied", color: "var(--color-chart-5)" },
} satisfies ChartConfig

const revenueChartConfig = {
  billed: { label: "Billed ($M)", color: "var(--color-chart-2)" },
  collected: { label: "Collected ($M)", color: "var(--color-chart-1)" },
} satisfies ChartConfig

const losChartConfig = {
  los: { label: "Length of Stay", color: "var(--color-chart-1)" },
  target: { label: "Target LOS", color: "var(--color-chart-2)" },
} satisfies ChartConfig

const caseMixConfig = {
  count: { label: "Case Volume", color: "var(--color-chart-3)" },
} satisfies ChartConfig

export function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Healthcare Analytics Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Monitor operational throughput, quality benchmarks, and financial outcomes in one analytics workspace.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly Visits</CardDescription>
            <CardTitle className="text-3xl">882</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1 text-xs text-emerald-600">
            <IconTrendingUp className="size-4" /> +6.3% from previous week
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Wait Time</CardDescription>
            <CardTitle className="text-3xl">18 min</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1 text-xs text-emerald-600">
            <IconTrendingDown className="size-4" /> -2 mins from baseline
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Readmission Rate</CardDescription>
            <CardTitle className="text-3xl">7.8%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Lower than target threshold (8.5%)</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collection Efficiency</CardDescription>
            <CardTitle className="text-3xl">86.2%</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-1 text-xs text-emerald-600">
            <IconArrowNarrowUp className="size-4" /> Improved billing performance
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Volume and Flow</CardTitle>
            <CardDescription>Visits, admissions, and discharge performance across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly-volume">
              <TabsList variant="line">
                <TabsTrigger value="weekly-volume">Weekly Volume</TabsTrigger>
                <TabsTrigger value="quality-trends">Quality Trends</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly-volume">
                <ChartContainer config={volumeChartConfig} className="h-72 w-full">
                  <ComposedChart data={weeklyVolumeData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      yAxisId="left"
                      dataKey="admissions"
                      fill="var(--color-admissions)"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="discharges"
                      fill="var(--color-discharges)"
                      radius={[5, 5, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="visits"
                      stroke="var(--color-visits)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </ComposedChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="quality-trends">
                <ChartContainer config={qualityChartConfig} className="h-72 w-full">
                  <AreaChart data={qualityKpiData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="satisfaction"
                      fill="var(--color-satisfaction)"
                      fillOpacity={0.2}
                      stroke="var(--color-satisfaction)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="readmissionRate"
                      stroke="var(--color-readmissionRate)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Status Distribution</CardTitle>
            <CardDescription>Current cycle claims pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChartContainer config={claimChartConfig} className="h-56 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={claimStatusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2 text-xs">
              {claimStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.name}</span>
                  <Badge variant="outline">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Utilization</CardTitle>
            <CardDescription>Occupancy and wait-time benchmark by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={departmentChartConfig} className="h-72 w-full">
              <BarChart data={departmentLoadData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="department" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="occupancy" fill="var(--color-occupancy)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="avgWait" fill="var(--color-avgWait)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Performance</CardTitle>
            <CardDescription>Billed vs collected revenue trend (in millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-72 w-full">
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="billed"
                  stroke="var(--color-billed)"
                  fill="var(--color-billed)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="collected" stroke="var(--color-collected)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Length of Stay by Cohort</CardTitle>
            <CardDescription>Average inpatient stay against department targets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={losChartConfig} className="h-72 w-full">
              <BarChart data={lengthOfStayData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="cohort" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="los" fill="var(--color-los)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="target" fill="var(--color-target)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Diagnosis Case Mix</CardTitle>
            <CardDescription>Volume distribution by dominant clinical diagnosis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={caseMixConfig} className="h-72 w-full">
              <BarChart data={caseMixData} layout="vertical" margin={{ left: 18, right: 8 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="diagnosis" type="category" tickLine={false} axisLine={false} width={88} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
