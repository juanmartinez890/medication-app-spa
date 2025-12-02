import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

type NotificationProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 5000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isSuccess = type === 'success'
  const bgColor = isSuccess ? 'bg-emerald-50' : 'bg-red-50'
  const borderColor = isSuccess ? 'border-emerald-200' : 'border-red-200'
  const textColor = isSuccess ? 'text-emerald-700' : 'text-red-700'
  const iconColor = isSuccess ? 'text-emerald-500' : 'text-red-500'
  const icon = isSuccess ? faCheckCircle : faTimesCircle

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border ${borderColor} ${bgColor} px-4 py-3 shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-right`}
      role="alert"
    >
      <FontAwesomeIcon icon={icon} className={`text-lg ${iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
      <button
        onClick={onClose}
        className={`rounded p-1 ${textColor} hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} className="text-sm" />
      </button>
    </div>
  )
}

