import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import SignUpPage from './pages/signUp.jsx'
import LoginPage from './pages/login.jsx'
import DashboardPage from './pages/dashboard.jsx'
import ProjectsPage from './pages/projects.jsx'
import MonitorPage from './pages/monitor.jsx'
import VerifyEmailPage from './pages/verifyEmail.jsx'
import LandingPage from './pages/landing.jsx'

// protect routes that require authentication
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

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
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}

export default function App() {
      

  return (
    <BrowserRouter>
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
              
              <Route path="/verifyEmail" element={<VerifyEmailPage />} />
      </Routes>
       
    </BrowserRouter>
  )
}
