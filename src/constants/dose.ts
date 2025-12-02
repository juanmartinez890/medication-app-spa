export const DOSE_CONSTANTS = {
  MISSED_THRESHOLD_MINUTES: 30,
  URGENT_THRESHOLD_HOURS: 2,
  ERROR_CLEAR_TIMEOUT_MS: 5000,
} as const

export const DATE_GROUP_LABELS = ['Today', 'Tomorrow', 'This Week', 'Later'] as const

export type DateGroupLabel = typeof DATE_GROUP_LABELS[number]

