import { create } from "zustand"

export type Patient = {
  id: string
  name: string
  age: number
  condition: string
  status: "Critical" | "Stable" | "Observation"
  ward: string
}

const patientsSeed: Patient[] = [
  { id: "P-1001", name: "Amelia Johnson", age: 49, condition: "Cardiac Monitoring", status: "Critical", ward: "ICU-2" },
  { id: "P-1002", name: "Ethan Miller", age: 35, condition: "Post-Surgery Recovery", status: "Stable", ward: "Ward-4" },
  { id: "P-1003", name: "Sophia Davis", age: 62, condition: "Diabetes Management", status: "Observation", ward: "Ward-1" },
  { id: "P-1004", name: "Noah Wilson", age: 28, condition: "Respiratory Evaluation", status: "Observation", ward: "Ward-3" },
  { id: "P-1005", name: "Olivia Brown", age: 41, condition: "Hypertension Stabilization", status: "Stable", ward: "Ward-2" },
  { id: "P-1006", name: "Liam Taylor", age: 57, condition: "Renal Function Monitoring", status: "Observation", ward: "Ward-5" },
  { id: "P-1007", name: "Ava Martinez", age: 33, condition: "Postpartum Recovery", status: "Stable", ward: "Ward-6" },
  { id: "P-1008", name: "Mason Anderson", age: 66, condition: "Stroke Rehabilitation", status: "Critical", ward: "ICU-1" },
  { id: "P-1009", name: "Isabella Thomas", age: 52, condition: "Oncology Cycle Follow-up", status: "Observation", ward: "Ward-7" },
  { id: "P-1010", name: "James Jackson", age: 45, condition: "Liver Profile Assessment", status: "Stable", ward: "Ward-2" },
  { id: "P-1011", name: "Mia White", age: 29, condition: "Respiratory Infection Care", status: "Observation", ward: "Ward-3" },
  { id: "P-1012", name: "Benjamin Harris", age: 73, condition: "Cardiac Arrhythmia Supervision", status: "Critical", ward: "ICU-3" },
  { id: "P-1013", name: "Charlotte Martin", age: 38, condition: "Endocrine Therapy Review", status: "Stable", ward: "Ward-4" },
  { id: "P-1014", name: "Lucas Thompson", age: 60, condition: "Pulmonary Embolism Observation", status: "Critical", ward: "ICU-4" },
  { id: "P-1015", name: "Harper Garcia", age: 47, condition: "Orthopedic Rehabilitation", status: "Stable", ward: "Ward-8" },
  { id: "P-1016", name: "Elijah Rodriguez", age: 55, condition: "Neurological Monitoring", status: "Observation", ward: "Ward-5" },
]

type PatientViewMode = "grid" | "list"

type PatientStore = {
  patients: Patient[]
  viewMode: PatientViewMode
  setViewMode: (mode: PatientViewMode) => void
  addPatient: (patient: Omit<Patient, "id">) => void
}

export const usePatientStore = create<PatientStore>((set) => ({
  patients: patientsSeed,
  viewMode: "grid",
  setViewMode: (mode) => set({ viewMode: mode }),
  addPatient: (patient) =>
    set((state) => {
      const maxId = state.patients.reduce((max, current) => {
        const numericPart = Number.parseInt(current.id.replace("P-", ""), 10)
        return Number.isFinite(numericPart) ? Math.max(max, numericPart) : max
      }, 1000)

      return {
        patients: [
          {
            id: `P-${String(maxId + 1).padStart(4, "0")}`,
            ...patient,
          },
          ...state.patients,
        ],
      }
    }),
}))
