import React, { useMemo, useState } from 'react'

 import {  signupStart,
  signupSuccess,
  signupFailure,
 } from '../slices/authSlice.js'
import { useDispatch}  from 'react-redux'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
   const dispatch =   useDispatch()
    

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      email.trim().includes('@') &&
      password.length >= 6 &&
      password === confirmPassword
    )
  }, [name, email, password, confirmPassword])
dispatch(signupStart())
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Signup failed')
        return
      }

      const token = data?.data?.token
      if (token) localStorage.setItem('token', token)

      setSuccess('Account created. You can continue to login.')
       dispatch(signupSuccess({user:data?.data?.user, token}))
    } catch {
      setError('Network error. Please try again.')
       dispatch(signupFailure(error?.message || 'Network error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] rounded-2xl border border-[var(--border)] bg-white/60 shadow-[var(--shadow)] text-left backdrop-blur">
        <div className="rounded-t-2xl p-6 bg-gradient-to-r from-cyan-500/10 via-emerald-400/10 to-green-400/10 border-b border-[var(--border)]">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="m-0 text-3xl text-[var(--text-h)] font-medium">
              Create account
            </h1>
            <span className="text-xs px-3 py-1 rounded-full whitespace-nowrap text-[#3CFF87] border border-[rgba(60,255,135,0.35)] bg-[rgba(60,255,135,0.12)]">
              Muted Blue + Green
            </span>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="mb-4 rounded-xl border border-[rgba(0,255,170,0.35)] bg-[rgba(0,255,170,0.10)] text-[var(--text-h)] px-4 py-3">
              {success}
            </div>
          ) : null}

          <form className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid gap-1">
              <label className="text-sm text-[var(--text-h)]">Name</label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/70 px-3 py-2 outline-none focus:border-emerald-500/80 focus:shadow-[0_0_0_4px_rgba(0,220,120,0.12)]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                type="password"
                required
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-[var(--text-h)]">Confirm password</label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/70 px-3 py-2 outline-none focus:border-emerald-500/80 focus:shadow-[0_0_0_4px_rgba(0,220,120,0.12)]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                type="password"
                required
              />
            </div>

            {error ? <div className="text-sm text-[#ff4d6d]">{error}</div> : null}

            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="mt-2 w-full rounded-xl py-3 font-semibold text-[#062012] bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-lime-500/90 hover:brightness-105 disabled:opacity-80 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Creating...' : 'Sign up'}
            </button>

            <div
              className="text-sm text-[var(--text-h)] text-right cursor-pointer select-none mt-1"
              onClick={() => {
                window.location.href = '/login'
              }}
            >
              Already have an account? Login
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

