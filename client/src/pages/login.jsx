import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canSubmit = useMemo(() => {
    return email.trim().includes('@') && password.length >= 6
  }, [email, password])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!canSubmit) {
      setError('Please enter a valid email and a password with at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Login failed')
        return
      }

      const token = data?.data?.token
      if (token) localStorage.setItem('token', token)

      setSuccess('Welcome back. Redirecting to your dashboard...')
      navigate('/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] rounded-2xl border border-[var(--border)] bg-white/70 shadow-[var(--shadow)] backdrop-blur">
        <div className="rounded-t-2xl border-b border-[var(--border)] bg-gradient-to-r from-cyan-500/10 via-emerald-400/10 to-green-400/10 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="m-0 text-3xl font-medium text-[var(--text-h)]">Welcome back</h1>
            <span className="whitespace-nowrap rounded-full border border-[rgba(60,255,135,0.35)] bg-[rgba(60,255,135,0.12)] px-3 py-1 text-xs text-[#3CFF87]">
              Fresh green
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--text-h)]/80">Sign in to continue with your account.</p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="mb-4 rounded-xl border border-[rgba(0,255,170,0.35)] bg-[rgba(0,255,170,0.10)] px-4 py-3 text-[var(--text-h)]">
              {success}
            </div>
          ) : null}

          <form className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid gap-1">
              <label className="text-sm text-[var(--text-h)]">Email</label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/70 px-3 py-2 outline-none focus:border-emerald-500/80 focus:shadow-[0_0_0_4px_rgba(0,220,120,0.12)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                type="email"
                required
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-[var(--text-h)]">Password</label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/70 px-3 py-2 outline-none focus:border-emerald-500/80 focus:shadow-[0_0_0_4px_rgba(0,220,120,0.12)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                type="password"
                required
              />
            </div>

            {error ? <div className="text-sm text-[#ff4d6d]">{error}</div> : null}

            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-lime-500/90 py-3 font-semibold text-[#062012] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>

            <div
              className="mt-1 cursor-pointer select-none text-right text-sm text-[var(--text-h)]"
              onClick={() => {
                navigate('/signup')
              }}
            >
              Don&apos;t have an account? Sign up
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
