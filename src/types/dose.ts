import { type DoseStatus } from '../constants/doseStatus'

export type Medication = {
  name: string
  dosage: string
  recurrence: string
  notes?: string
  active?: boolean
}

export type Dose = {
  doseId: string
  medicationId: string
  careRecipientId: string
  dueAt: string
  status: DoseStatus
  medication: Medication
}

