import { DOSE_CONSTANTS } from '../constants/dose'
import { DOSE_STATUS, type DoseStatus } from '../constants/doseStatus'

/**
 * Formats a date-time string into readable date and time
 * @param iso - ISO date-time string
 * @returns Object with formatted date and time strings
 */
export function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  // Use UTC methods to avoid timezone conversion
  const month = d.getUTCMonth()
  const day = d.getUTCDate()
  const hours = d.getUTCHours()
  const minutes = d.getUTCMinutes()
  
  // Format date using UTC values directly
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateStr = `${monthNames[month]} ${day}`
  
  const timeStr12 = `${((hours % 12) || 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
  
  return { date: dateStr, time: timeStr12 }
}

/**
 * Formats a date into a group label (Today, Tomorrow, This Week, Later)
 * @param iso - ISO date-time string
 * @returns Group label string
 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekFromNow = new Date(today)
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const doseDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

  if (doseDate.getTime() === todayDate.getTime()) {
    return 'Today'
  } else if (doseDate.getTime() === tomorrowDate.getTime()) {
    return 'Tomorrow'
  } else if (d.getTime() <= weekFromNow.getTime()) {
    return 'This Week'
  } else {
    return 'Later'
  }
}

/**
 * Checks if a dose is missed (30+ minutes past due time)
 * @param iso - ISO date-time string
 * @param status - Current status of the dose
 * @returns True if the dose is missed
 */
export function isMissed(iso: string, status: DoseStatus | string): boolean {
  if (status === DOSE_STATUS.TAKEN) {
    return false
  }
  const now = new Date()
  const doseTime = new Date(iso)
  const minutesDiff = (now.getTime() - doseTime.getTime()) / (1000 * 60)
  // Missed if threshold minutes or more past the due time
  return minutesDiff >= DOSE_CONSTANTS.MISSED_THRESHOLD_MINUTES
}

/**
 * Gets the appropriate CSS classes for the time badge based on status and timing
 * @param iso - ISO date-time string
 * @param status - Current status of the dose
 * @returns CSS class string for the badge
 */
export function getTimeBadgeColor(iso: string, status: DoseStatus | string): string {
  if (status === DOSE_STATUS.TAKEN) {
    return 'bg-slate-100 text-slate-600'
  }
  if (isMissed(iso, status)) {
    return 'bg-red-50 text-red-700'
  }
  const now = new Date()
  const doseTime = new Date(iso)
  const hoursDiff = (doseTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursDiff < 0) {
    return 'bg-red-50 text-red-700'
  } else if (hoursDiff < DOSE_CONSTANTS.URGENT_THRESHOLD_HOURS) {
    return 'bg-amber-50 text-amber-700'
  } else {
    return 'bg-emerald-50 text-emerald-700'
  }
}

