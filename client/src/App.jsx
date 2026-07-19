import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SignUpPage from './pages/signUp.jsx'
import LoginPage from './pages/login.jsx'
import DashboardPage from './pages/dashboard.jsx'
import ProjectsPage from './pages/projects.jsx'
import MonitorPage from './pages/monitor.jsx'
import LogPage from './pages/logpage.jsx'
import VerifyEmailPage from './pages/verifyEmail.jsx'
import LandingPage from './landing.jsx'
import SettingsPage from './pages/settings.jsx'
import AnalyticsPage from './pages/analytics.jsx'
import { SidebarProvider } from './context/SidebarContext'
import { AuthProvider } from './components/AuthProvider'

// protect routes that require authentication
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user, isAuthChecking } = useSelector((state) => state.auth)

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!user?.isVerified) {
    return <Navigate to='/verifyEmail' replace />
  }

  return children
}

// redirect authenticated user to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isAuthChecking } = useSelector((state) => state.auth)

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}

export default function App() {


  return (
    <BrowserRouter>
      <SidebarProvider>
        <AuthProvider>
          <Routes>
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/signup" element={
          <RedirectAuthenticatedUser><SignUpPage /> </RedirectAuthenticatedUser>} />
        <Route path="/login" element={
          <RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>
        } />
        <Route path="/" element={

          <ProtectRoute >
            <DashboardPage />
          </ProtectRoute>
        } />
        <Route path="/projects" element={
          <ProtectRoute>
            <ProjectsPage />
          </ProtectRoute>
        } />
<Route path="/monitor" element={
          <ProtectRoute>
            <MonitorPage />
          </ProtectRoute>
        } />
        <Route path="/logs" element={
          <ProtectRoute>
            <LogPage />
          </ProtectRoute>
        } />
        <Route path="/settings" element={
          <ProtectRoute>
            <SettingsPage />
          </ProtectRoute>
        } />
        <Route path="/analytics" element={
          <ProtectRoute>
            <AnalyticsPage />
          </ProtectRoute>
        } />

<Route path="/verifyEmail" element={<VerifyEmailPage />} />
          </Routes>
        </AuthProvider>
      </SidebarProvider>
    </BrowserRouter>
  )
}
