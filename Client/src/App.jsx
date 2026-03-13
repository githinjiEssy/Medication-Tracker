import './App.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MedicationsPage from './pages/MedicationsPage'
import AdverseReactions from './pages/AdverseReactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import NotificationsPage from './pages/NotificationsPage'
import SchedulePage from './pages/SchedulePage'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/reactions" element={<AdverseReactions />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
