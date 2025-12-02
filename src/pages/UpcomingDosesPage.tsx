import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPills } from '@fortawesome/free-solid-svg-icons'
import { getOrCreateCareRecipientId } from '../utils/careRecipient'
import { colors } from '../theme'
import DoseCard from '../components/DoseCard'
import { getUpcomingDoses, markDoseAsTaken } from '../services/dosesService'
import { type Dose } from '../types'
import { DOSE_STATUS } from '../constants/doseStatus'
import { DOSE_CONSTANTS, DATE_GROUP_LABELS } from '../constants/dose'
import { formatDate } from '../utils/dateUtils'

type GroupedDoses = {
  label: string
  doses: Dose[]
}

export default function UpcomingDosesPage() {
  const [doses, setDoses] = useState<Dose[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markingAsTaken, setMarkingAsTaken] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        setLoading(true)
        setError(null)

        const careRecipientId = getOrCreateCareRecipientId()
        const data = await getUpcomingDoses(careRecipientId)
        setDoses(data)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error loading doses'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcoming()
  }, [])

  const handleMarkAsTaken = async (dose: Dose) => {
    try {
      setMarkingAsTaken(dose.doseId)
      const careRecipientId = getOrCreateCareRecipientId()
      
      await markDoseAsTaken(careRecipientId, dose.medicationId, dose.dueAt)
      
      // Update the dose in the list
      setDoses((prevDoses) =>
        prevDoses.map((d) =>
          d.doseId === dose.doseId
            ? { ...d, status: DOSE_STATUS.TAKEN }
            : d
        )
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to mark dose as taken'
      setError(message)
      // Clear error after timeout
      setTimeout(() => setError(null), DOSE_CONSTANTS.ERROR_CLEAR_TIMEOUT_MS)
    } finally {
      setMarkingAsTaken(null)
    }
  }

  const groupDosesByDate = (doses: Dose[]): GroupedDoses[] => {
    const grouped: Record<string, Dose[]> = {}

    doses.forEach((dose) => {
      const group = formatDate(dose.dueAt)
      if (!grouped[group]) {
        grouped[group] = []
      }
      grouped[group].push(dose)
    })

    return DATE_GROUP_LABELS.filter((label) => grouped[label])
      .map((label) => ({
        label,
        doses: grouped[label].sort(
          (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
        ),
      }))
  }

  const groupedDoses = groupDosesByDate(doses)

  return (
    <div className="min-h-screen w-full py-6 pb-24">
      <div className="mx-auto max-w-4xl px-4">

        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-slate-500">Loading upcoming doses…</p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && doses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FontAwesomeIcon
              icon={faPills}
              className="mb-4 text-4xl text-slate-300"
            />
            <p className="text-sm" style={{ color: colors.secondary }}>
              There are no upcoming doses scheduled.
            </p>
          </div>
        )}

        {!loading && !error && groupedDoses.length > 0 && (
          <div className="space-y-6">
            {groupedDoses.map((group) => (
              <div key={group.label} className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider pl-1" style={{ color: colors.secondary }}>
                  {group.label}
                </h2>
                <div className="space-y-5">
                  {group.doses.map((dose) => (
                    <DoseCard
                      key={dose.doseId}
                      dose={dose}
                      markingAsTaken={markingAsTaken}
                      onMarkAsTaken={handleMarkAsTaken}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        to="/new-medication"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 md:px-6 py-2 md:py-3 text-[11px] md:text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
        style={{ backgroundColor: colors.primary, fontWeight: 600, color: colors.white }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
        aria-label="Add New Medication"
      >
        <span className="text-lg md:text-xl font-bold" style={{ color: colors.white }}>+</span>
        <span className="hidden sm:inline" style={{ color: colors.white }}>New Medication</span>
      </Link>
    </div>
  )
  }
  