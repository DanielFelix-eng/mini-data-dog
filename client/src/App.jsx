import React from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'

import SignUpPage from './pages/signUp.jsx'
import LoginPage from './pages/login.jsx'
import DashboardPage from './pages/dashboard.jsx'
import ProjectsPage from './pages/projects.jsx'
import MonitorPage from './pages/monitor.jsx'
import VerifyEmailPage from './pages/verifyEmail.jsx'
import LandingPage from './pages/landing.jsx'

const ProtectRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to='/login' replace />
  }

  return children
}

const RedirectAuthenticatedUser = ({ children }) => {
  const token = localStorage.getItem('token')

  if (token) {
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
            <><SignUpPage /> </>} />
        <Route path="/login" element={
          <><LoginPage /></>
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

