export type Recurrence = 'DAILY' | 'WEEKLY'

export type MedicationPayload = {
  careRecipientId: string
  name: string
  dosage: string
  notes: string
  recurrence: Recurrence
  timesOfDay: string[] | null
  daysOfWeek: number[] | null
  active: boolean
}

import { apiRequest } from '../utils/apiClient'

/**
 * Creates a new medication
 * @param payload - The medication data to create
 * @returns Promise that resolves when the medication is created
 * @throws Error if the request fails
 */
export async function createMedication(payload: MedicationPayload): Promise<void> {
  await apiRequest<void>('/medications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Marks an existing medication as inactive for a given care recipient.
 * @param careRecipientId - The care recipient ID
 * @param medicationId - The medication ID to mark inactive
 */
export async function markMedicationInactive(
  careRecipientId: string,
  medicationId: string
): Promise<void> {
  await apiRequest<void>(
    `/care-recipients/${careRecipientId}/medications/${medicationId}/inactive`,
    {
      method: 'POST',
    }
  )
}

