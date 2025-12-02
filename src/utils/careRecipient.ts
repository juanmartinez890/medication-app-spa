const CARE_RECIPIENT_ID_KEY = 'careRecipientId'

export function getOrCreateCareRecipientId(): string {
  const existing = window.localStorage.getItem(CARE_RECIPIENT_ID_KEY)
  if (existing) return existing
  const generated = crypto.randomUUID()
  window.localStorage.setItem(CARE_RECIPIENT_ID_KEY, generated)
  return generated
}

