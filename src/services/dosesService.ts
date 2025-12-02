import { type Dose } from '../types'
import { apiRequest } from '../utils/apiClient'

/**
 * Fetches upcoming doses for a care recipient
 * @param careRecipientId - The ID of the care recipient
 * @returns Promise resolving to an array of upcoming doses
 * @throws Error if the request fails
 */
export async function getUpcomingDoses(careRecipientId: string): Promise<Dose[]> {
  return apiRequest<Dose[]>(`/care-recipients/${careRecipientId}/doses/upcoming`)
}

/**
 * Marks a dose as taken
 * @param careRecipientId - The ID of the care recipient
 * @param medicationId - The ID of the medication
 * @param dueAt - The due date/time of the dose in ISO format
 * @returns Promise that resolves when the dose is marked as taken
 * @throws Error if the request fails
 */
export async function markDoseAsTaken(
  careRecipientId: string,
  medicationId: string,
  dueAt: string
): Promise<void> {
  await apiRequest<void>(`/care-recipients/${careRecipientId}/doses/taken`, {
    method: 'POST',
    body: JSON.stringify({
      medicationId,
      dueAt,
    }),
  })
}

