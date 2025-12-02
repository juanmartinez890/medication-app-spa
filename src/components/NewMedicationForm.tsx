import { type FormEvent, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { colors } from '../theme'
import { createMedication, type MedicationPayload, type Recurrence } from '../services/medicationsService'
import { getOrCreateCareRecipientId } from '../utils/careRecipient'
import { FORM_DEFAULTS } from '../constants/formDefaults'

type NewMedicationFormProps = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export default function NewMedicationForm({ onSuccess, onError }: NewMedicationFormProps = {}) {
  const [careRecipientId, setCareRecipientId] = useState('')
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [notes, setNotes] = useState('')
  const [recurrence, setRecurrence] = useState<Recurrence>('DAILY')
  const [timesOfDay, setTimesOfDay] = useState<string[]>([FORM_DEFAULTS.DEFAULT_TIME])
  const [currentTimeInput, setCurrentTimeInput] = useState<string>(FORM_DEFAULTS.DEFAULT_TIME)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([...FORM_DEFAULTS.DEFAULT_DAYS_OF_WEEK])
  const [currentDayInput, setCurrentDayInput] = useState<string>(FORM_DEFAULTS.DEFAULT_DAY_INPUT)
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = getOrCreateCareRecipientId()
    setCareRecipientId(id)
  }, [])

  const addTime = () => {
    const time = currentTimeInput.trim()
    if (time && !timesOfDay.includes(time)) {
      setTimesOfDay([...timesOfDay, time].sort())
    }
  }

  const removeTime = (timeToRemove: string) => {
    setTimesOfDay(timesOfDay.filter((t) => t !== timeToRemove))
  }

  const addDay = () => {
    const day = Number.parseInt(currentDayInput, 10)
    if (!Number.isNaN(day) && day >= 0 && day <= 6 && !daysOfWeek.includes(day)) {
      setDaysOfWeek([...daysOfWeek, day].sort((a, b) => a - b))
    }
  }

  const removeDay = (dayToRemove: number) => {
    setDaysOfWeek(daysOfWeek.filter((d) => d !== dayToRemove))
  }

  const getDayName = (day: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[day] || `Day ${day}`
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name.trim() || !dosage.trim()) {
      setError('Name and dosage are required.')
      return
    }

    const payload: MedicationPayload = {
      careRecipientId,
      name: name.trim(),
      dosage: dosage.trim(),
      notes: notes.trim(),
      recurrence,
      timesOfDay: recurrence === 'DAILY' ? (timesOfDay.length > 0 ? timesOfDay : null) : null,
      daysOfWeek: recurrence === 'WEEKLY' ? (daysOfWeek.length > 0 ? daysOfWeek : null) : null,
      active,
    }

    try {
      setSubmitting(true)

      await createMedication(payload)

      setName('')
      setDosage('')
      setNotes('')
      setTimesOfDay([FORM_DEFAULTS.DEFAULT_TIME])
      setCurrentTimeInput(FORM_DEFAULTS.DEFAULT_TIME)
      setDaysOfWeek([...FORM_DEFAULTS.DEFAULT_DAYS_OF_WEEK])
      setCurrentDayInput(FORM_DEFAULTS.DEFAULT_DAY_INPUT)
      
      // Close drawer immediately and show success notification
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create medication.'
      setError(message)
      if (onError) {
        onError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full">

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            style={{ 
              '--tw-ring-color': colors.primary,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
            }}
            placeholder="Ibuprofen"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="dosage" style={{ color: colors.bodyDark }}>
            Dosage
          </label>
          <input
            id="dosage"
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            style={{ 
              '--tw-ring-color': colors.primary,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
            }}
            placeholder="200mg"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="notes" style={{ color: colors.bodyDark }}>
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            style={{ 
              '--tw-ring-color': colors.primary,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
            }}
            placeholder="Take with food"
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="recurrence" style={{ color: colors.bodyDark }}>
            Recurrence
          </label>
          <select
            id="recurrence"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as Recurrence)}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
            style={{ 
              '--tw-ring-color': colors.primary,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
            }}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        {recurrence === 'DAILY' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="timesOfDay" style={{ color: colors.bodyDark }}>
              Times of day
            </label>
            <div className="flex gap-2">
              <input
                id="timesOfDay"
                type="time"
                value={currentTimeInput}
                onChange={(e) => setCurrentTimeInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addTime}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: colors.primary, fontWeight: 600, color: colors.white }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
              >
                <span style={{ color: colors.white }}>Add</span>
              </button>
            </div>
            {timesOfDay.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {timesOfDay.map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: `${colors.primary}1A`, color: colors.primary }}
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => removeTime(time)}
                      className="rounded-full p-0.5 transition-colors"
                      style={{ '--hover-bg': `${colors.primary}33` } as React.CSSProperties & { '--hover-bg': string }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}33`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      aria-label={`Remove ${time}`}
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {recurrence === 'WEEKLY' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="daysOfWeek" style={{ color: colors.bodyDark }}>
              Days of week
            </label>
            <div className="flex gap-2">
              <select
                id="daysOfWeek"
                value={currentDayInput}
                onChange={(e) => setCurrentDayInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
              <button
                type="button"
                onClick={addDay}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: colors.primary, fontWeight: 600, color: colors.white }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
              >
                <span style={{ color: colors.white }}>Add</span>
              </button>
            </div>
            {daysOfWeek.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: `${colors.primary}1A`, color: colors.primary }}
                  >
                    {getDayName(day)}
                    <button
                      type="button"
                      onClick={() => removeDay(day)}
                      className="rounded-full p-0.5 transition-colors"
                      style={{ '--hover-bg': `${colors.primary}33` } as React.CSSProperties & { '--hover-bg': string }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}33`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                      aria-label={`Remove ${getDayName(day)}`}
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <label htmlFor="active" className="text-sm font-medium" style={{ color: colors.bodyDark }}>
            Active
          </label>
          <button
            type="button"
            id="active"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: active ? colors.primary : colors.toggleInactive,
              '--tw-ring-color': colors.primary,
            } as React.CSSProperties & { '--tw-ring-color': string }}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                active ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: colors.primary, fontWeight: 600, color: colors.white }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = colors.primaryHover
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = colors.primary
            }}
            onFocus={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = colors.primaryHover
            }}
            onBlur={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = colors.primary
            }}
          >
            <span style={{ color: colors.white }}>{submitting ? 'Creating…' : 'Create'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}


