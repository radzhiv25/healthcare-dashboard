import { useMemo, useState } from "react"
import { IconPlus, IconSearch } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { usePatientStore } from "@/store/patient-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PatientDetailsPage() {
  const { patients, viewMode, setViewMode, addPatient } = usePatientStore()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "Critical" | "Stable" | "Observation">("All")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newPatientName, setNewPatientName] = useState("")
  const [newPatientAge, setNewPatientAge] = useState("")
  const [newPatientCondition, setNewPatientCondition] = useState("")
  const [newPatientWard, setNewPatientWard] = useState("")
  const [newPatientStatus, setNewPatientStatus] = useState<"Critical" | "Stable" | "Observation">("Observation")
  const [formError, setFormError] = useState("")
  const isList = viewMode === "list"

  const statusColor = useMemo(
    () => ({
      Critical: "text-destructive",
      Stable: "text-emerald-600",
      Observation: "text-amber-600",
    }),
    []
  )

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return patients.filter((patient) => {
      const matchesStatus = statusFilter === "All" || patient.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        patient.name.toLowerCase().includes(normalizedQuery) ||
        patient.id.toLowerCase().includes(normalizedQuery) ||
        patient.condition.toLowerCase().includes(normalizedQuery) ||
        patient.ward.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [patients, query, statusFilter])

  const statusTotals = useMemo(
    () => ({
      total: patients.length,
      critical: patients.filter((patient) => patient.status === "Critical").length,
      stable: patients.filter((patient) => patient.status === "Stable").length,
      observation: patients.filter((patient) => patient.status === "Observation").length,
    }),
    [patients]
  )

  const highRiskRate = Math.round((statusTotals.critical / Math.max(statusTotals.total, 1)) * 100)
  const icuAdmissions = patients.filter((patient) => patient.ward.startsWith("ICU")).length

  const resetAddPatientForm = () => {
    setNewPatientName("")
    setNewPatientAge("")
    setNewPatientCondition("")
    setNewPatientWard("")
    setNewPatientStatus("Observation")
    setFormError("")
  }

  const handleAddPatient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError("")

    const parsedAge = Number.parseInt(newPatientAge, 10)
    if (!newPatientName.trim() || !newPatientCondition.trim() || !newPatientWard.trim()) {
      setFormError("Please fill all required patient details.")
      return
    }
    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setFormError("Please enter a valid age between 0 and 120.")
      return
    }

    addPatient({
      name: newPatientName.trim(),
      age: parsedAge,
      condition: newPatientCondition.trim(),
      ward: newPatientWard.trim(),
      status: newPatientStatus,
    })

    setAddDialogOpen(false)
    resetAddPatientForm()
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Patient Intelligence Hub</h1>
        <p className="text-sm text-muted-foreground">
          Track patient cohorts, triage risk, and current treatment statuses with dynamic filtering.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Total Patients</p>
            <CardTitle className="text-3xl">{statusTotals.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Critical</p>
            <CardTitle className="text-3xl text-destructive">{statusTotals.critical}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Stable</p>
            <CardTitle className="text-3xl text-emerald-600">{statusTotals.stable}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Observation</p>
            <CardTitle className="text-3xl text-amber-600">{statusTotals.observation}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">High-Risk Cohort</p>
            <CardTitle className="text-2xl">{highRiskRate}%</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Percentage of active critical patients in current census.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">ICU Admissions</p>
            <CardTitle className="text-2xl">{icuAdmissions}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Live count of patients assigned to ICU departments.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Follow-up Flagged</p>
            <CardTitle className="text-2xl">
              {patients.filter((patient) => patient.status !== "Stable").length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Patients needing close watch and clinician follow-up.
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border bg-card p-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by patient, ID, ward or condition"
            className="pl-8"
          />
        </div>
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Critical">Critical</TabsTrigger>
            <TabsTrigger value="Stable">Stable</TabsTrigger>
            <TabsTrigger value="Observation">Observation</TabsTrigger>
          </TabsList>
          <TabsContent value={statusFilter} />
        </Tabs>
        <label className="flex shrink-0 items-center gap-2 text-sm">
          <span>Grid</span>
          <Switch checked={isList} onCheckedChange={(checked) => setViewMode(checked ? "list" : "grid")} />
          <span>List</span>
        </label>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <IconPlus className="size-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Register a patient into the live care census for triage and ward management.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-3" onSubmit={handleAddPatient}>
              <div className="space-y-1">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={newPatientName}
                  onChange={(event) => setNewPatientName(event.target.value)}
                  placeholder="Enter patient full name"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="patientAge">Age</Label>
                  <Input
                    id="patientAge"
                    value={newPatientAge}
                    onChange={(event) => setNewPatientAge(event.target.value)}
                    placeholder="e.g. 45"
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="patientStatus">Status</Label>
                  <select
                    id="patientStatus"
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                    value={newPatientStatus}
                    onChange={(event) =>
                      setNewPatientStatus(event.target.value as "Critical" | "Stable" | "Observation")
                    }
                  >
                    <option value="Observation">Observation</option>
                    <option value="Stable">Stable</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="patientCondition">Condition</Label>
                <Input
                  id="patientCondition"
                  value={newPatientCondition}
                  onChange={(event) => setNewPatientCondition(event.target.value)}
                  placeholder="Primary condition or diagnosis"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="patientWard">Ward</Label>
                <Input
                  id="patientWard"
                  value={newPatientWard}
                  onChange={(event) => setNewPatientWard(event.target.value)}
                  placeholder="e.g. ICU-2 / Ward-4"
                />
              </div>
              {formError ? <p className="text-xs text-destructive">{formError}</p> : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setAddDialogOpen(false); resetAddPatientForm() }}>
                  Cancel
                </Button>
                <Button type="submit">Save Patient</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      {isList ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-120 text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="p-3">{patient.id}</td>
                    <td className="p-3">{patient.name}</td>
                    <td className="p-3">{patient.age}</td>
                    <td className="p-3">{patient.condition}</td>
                    <td className="p-3">{patient.ward}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          patient.status === "Critical"
                            ? "destructive"
                            : patient.status === "Stable"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </td>
                    <td className={`p-3 font-medium ${statusColor[patient.status]}`}>{patient.status === "Critical" ? "91" : patient.status === "Observation" ? "64" : "38"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredPatients.length ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No patients found for this filter.</p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {patient.name}
                  <Badge
                    variant={
                      patient.status === "Critical"
                        ? "destructive"
                        : patient.status === "Stable"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {patient.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>ID: {patient.id}</p>
                <p>Age: {patient.age}</p>
                <p>Condition: {patient.condition}</p>
                <p>Ward: {patient.ward}</p>
                <p className={`font-medium ${statusColor[patient.status]}`}>Risk Score: {patient.status === "Critical" ? 91 : patient.status === "Observation" ? 64 : 38}/100</p>
                <p className="text-xs text-muted-foreground">
                  Last Update:{" "}
                  {patient.status === "Critical"
                    ? "4 minutes ago"
                    : patient.status === "Observation"
                      ? "14 minutes ago"
                      : "26 minutes ago"}
                </p>
              </CardContent> 
            </Card>
          ))}
          {!filteredPatients.length ? (
            <Card className="sm:col-span-2 xl:col-span-3">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No patient records match the selected query and status filters.
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}
