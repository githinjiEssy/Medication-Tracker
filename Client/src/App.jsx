import './App.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import MedicationsPage from './pages/MedicationsPage'
import AdverseReactions from './pages/AdverseReactionsPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/reactions" element={<AdverseReactions />} />
      </Routes>
    </Router>
  )
}

export default App
