import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPills,
  faClock,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons'
import { colors } from '../theme'
import { type Dose } from '../types'
import { DOSE_STATUS } from '../constants/doseStatus'
import { formatDateTime, isMissed, getTimeBadgeColor } from '../utils/dateUtils'

type DoseCardProps = {
  dose: Dose
  markingAsTaken: string | null
  inactivatingMedicationId: string | null
  onMarkAsTaken: (dose: Dose) => void
  onToggleMedicationActive: (dose: Dose, nextActive: boolean) => void
}

export default function DoseCard({
  dose,
  markingAsTaken,
  inactivatingMedicationId,
  onMarkAsTaken,
  onToggleMedicationActive,
}: DoseCardProps) {
  const isMedicationActive = dose.medication?.active !== false
  const isInactivating = inactivatingMedicationId === dose.medicationId

  return (
    <article
      key={dose.doseId}
      className="group relative rounded-xl border border-white/40 bg-white/90 backdrop-blur-sm p-4 md:p-6 shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.primary}1A`, color: colors.primary }}>
            <FontAwesomeIcon icon={faPills} className="text-base md:text-lg" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold mb-1" style={{ fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 600, color: colors.headline }}>
                {dose.medication?.name ?? 'Medication'}
              </h3>
              <div className="space-y-1.5">
                {dose.medication?.dosage && (
                  <p className="text-xs md:text-sm" style={{ color: colors.bodyDark }}>
                    {dose.medication.dosage}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {dose.medication?.recurrence && (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] md:text-xs font-medium uppercase tracking-wide text-slate-600">
                      {dose.medication.recurrence}
                    </span>
                  )}
                </div>
                {dose.medication?.notes && (
                  <p className="text-[11px] md:text-xs leading-relaxed" style={{ color: colors.secondary }}>
                    {dose.medication.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side - Time, Status and Actions */}
            <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-2 md:gap-2.5 w-full sm:w-auto">
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold ${getTimeBadgeColor(dose.dueAt, dose.status)}`}
                  >
                    <FontAwesomeIcon icon={faClock} className="text-[9px] md:text-[10px]" />
                    {formatDateTime(dose.dueAt).time}
                  </span>
                  {isMissed(dose.dueAt, dose.status) && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold text-red-700">
                      Missed
                    </span>
                  )}
                </div>
                <span className="text-[9px] md:text-[10px] font-medium text-slate-500">
                  {formatDateTime(dose.dueAt).date}
                </span>
              </div>
              {dose.status === DOSE_STATUS.UPCOMING && isMedicationActive && (
                <button
                  className="flex items-center justify-center gap-1.5 rounded-full px-4 md:px-6 py-2 md:py-3 text-[11px] md:text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto"
                  style={{ backgroundColor: colors.primary, fontWeight: 600, color: colors.white }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                  onFocus={(e) => e.currentTarget.style.backgroundColor = colors.primaryHover}
                  onBlur={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                  onClick={() => onMarkAsTaken(dose)}
                  disabled={markingAsTaken === dose.doseId}
                >
                  {markingAsTaken === dose.doseId ? (
                    <>
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span style={{ color: colors.white }}>Marking...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-[10px] md:text-xs" style={{ color: colors.white }} />
                      <span style={{ color: colors.white }}>Mark as Taken</span>
                    </>
                  )}
                </button>
              )}
              {dose.status === DOSE_STATUS.TAKEN && (
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium" style={{ color: colors.secondary }}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-emerald-500"
                  />
                  Taken
                </div>
              )}
              {/* Medication active/inactive toggle */}
              <div className="mt-1 flex items-center gap-2 text-[10px] md:text-xs">
                <span style={{ color: colors.secondary }}>
                  {isMedicationActive ? 'Medication is active' : 'Medication is inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleMedicationActive(dose, !isMedicationActive)}
                  disabled={!isMedicationActive || isInactivating}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:opacity-60 ${
                    isMedicationActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                  aria-pressed={isMedicationActive}
                  aria-label={isMedicationActive ? 'Mark medication as inactive' : 'Medication inactive'}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                      isMedicationActive ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

