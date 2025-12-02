import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import UpcomingDosesPage from './pages/UpcomingDosesPage'
import MedicationDrawer from './components/MedicationDrawer'
import Notification from './components/Notification'
import HomethriveLogo from './assets/Homethrive_Logo.svg'
import { gradients } from './theme'

type NotificationState = {
  message: string
  type: 'success' | 'error'
} | null

function AppContent() {
  const location = useLocation()
  const showDrawer = location.pathname === '/new-medication'
  const [notification, setNotification] = useState<NotificationState>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
  }

  const hideNotification = () => {
    setNotification(null)
  }

  return (
    <div className="min-h-screen" style={{ background: gradients.background }}>
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-3">
            <Link to="/" className="flex items-center">
              <img
                src={HomethriveLogo}
                alt="Homethrive"
                className="h-6 w-auto"
              />
            </Link>
        </div>
      </header>

      <main className="w-full">
        <Routes>
          <Route path="/" element={<UpcomingDosesPage />} />
        </Routes>
      </main>

      {showDrawer && (
        <MedicationDrawer onNotification={showNotification} />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
