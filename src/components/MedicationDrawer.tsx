import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import NewMedicationForm from './NewMedicationForm'
import { colors } from '../theme'

type MedicationDrawerProps = {
  onNotification?: (message: string, type: 'success' | 'error') => void
}

export default function MedicationDrawer({ onNotification }: MedicationDrawerProps) {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  const handleSuccess = () => {
    handleClose()
    if (onNotification) {
      onNotification('Medication created successfully', 'success')
    }
  }

  const handleError = (message: string) => {
    if (onNotification) {
      onNotification(message, 'error')
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-out overflow-y-auto"
        style={{
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", "Georgia", serif', fontWeight: 600, color: colors.headline }}>
            New Medication
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close drawer"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <NewMedicationForm onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </>
  )
}

