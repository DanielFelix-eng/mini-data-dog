import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendMessage, setResendMessage] = useState('')

  const hasToken = useMemo(() => {
    return Boolean(localStorage.getItem('token'))
  }, [])

  const canSubmit = useMemo(() => code.trim().length >= 5, [code])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setResendMessage('')

    if (!canSubmit) {
      setError('Enter the verification code sent to your email.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/verifyEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Verification failed. Please try again.')
        return
      }

      setSuccess('Email verified successfully. Redirecting to your dashboard...')
      window.setTimeout(() => navigate('/'), 1200)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resendVerification = async () => {
    setError('')
    setSuccess('')
    setResendMessage('')

    try {
      const res = await fetch('/api/resendVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.message || 'Unable to resend verification email.')
        return
      }

      setResendMessage('Verification email resent. Please check your inbox.')
    } catch {
      setError('Network error. Please try again.')
    }
  }

  if (!hasToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-[520px] rounded-2xl border border-[var(--border)] bg-white/70 shadow-[var(--shadow)] backdrop-blur p-8 text-center">
          <h1 className="text-3xl font-semibold text-[var(--text-h)]">Verification required</h1>
          <p className="mt-4 text-[var(--text-h)]/80">Please sign in to verify your email.</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 rounded-xl bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-lime-500/90 px-6 py-3 font-semibold text-[#062012] hover:brightness-105"
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] rounded-2xl border border-[var(--border)] bg-white/60 shadow-[var(--shadow)] backdrop-blur">
        <div className="rounded-t-2xl border-b border-[var(--border)] bg-gradient-to-r from-cyan-500/10 via-emerald-400/10 to-green-400/10 p-6">
          <div className="flex flex-col gap-3">
            <h1 className="m-0 text-3xl font-medium text-[var(--text-h)]">Verify your email</h1>
            <p className="text-[var(--text-h)]/80">Enter the code we sent to your inbox to continue.</p>
            <span className="inline-flex items-center rounded-full border border-[rgba(60,255,135,0.35)] bg-[rgba(60,255,135,0.12)] px-3 py-1 text-xs text-[#3CFF87]">
              Check spam or promotions folder if needed
            </span>
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="mb-4 rounded-xl border border-[rgba(255,77,109,0.35)] bg-[rgba(255,77,109,0.10)] px-4 py-3 text-[var(--text-h)]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 rounded-xl border border-[rgba(0,255,170,0.35)] bg-[rgba(0,255,170,0.10)] px-4 py-3 text-[var(--text-h)]">
              {success}
            </div>
          ) : null}

          {resendMessage ? (
            <div className="mb-4 rounded-xl border border-[rgba(0,255,170,0.35)] bg-[rgba(0,255,170,0.10)] px-4 py-3 text-[var(--text-h)]">
              {resendMessage}
            </div>
          ) : null}

          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <label className="text-sm text-[var(--text-h)]">Verification code</label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-white/70 px-3 py-3 text-lg font-medium outline-none focus:border-emerald-500/80 focus:shadow-[0_0_0_4px_rgba(0,220,120,0.12)]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                autoComplete="one-time-code"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-lime-500/90 py-3 font-semibold text-[#062012] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitting ? 'Verifying...' : 'Verify email'}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--text-h)]">
            <button
              type="button"
              onClick={resendVerification}
              className="rounded-xl border border-[var(--border)] bg-white/70 px-4 py-3 font-medium text-[var(--text-h)] hover:bg-white"
            >
              Resend verification email
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-xl px-4 py-3 text-[var(--text-h)] transition hover:text-[#062012]"
            >
              Use a different account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
