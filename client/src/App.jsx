import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import SignUpPage from './pages/signUp.jsx'
import LoginPage from './pages/login.jsx'
import DashboardPage from './pages/dashboard.jsx'

function Home() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1 style={{ marginTop: 24 }}>Welcome</h1>
      <p style={{ marginBottom: 18 }}>Create an account or sign in.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/signup"
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'linear-gradient(90deg, rgba(0, 180, 255, 0.85), rgba(0, 255, 170, 0.85), rgba(60, 255, 135, 0.9))',
            color: '#062012',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Sign up
        </Link>
        <Link
          to="/login"
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.65)',
            color: 'var(--text-h)',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

