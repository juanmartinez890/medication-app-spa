export const DOSE_STATUS = {
  UPCOMING: 'UPCOMING',
  TAKEN: 'TAKEN',
  MISSED: 'MISSED',
} as const

export type DoseStatus = typeof DOSE_STATUS[keyof typeof DOSE_STATUS]

