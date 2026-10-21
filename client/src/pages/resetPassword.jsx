import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await fetch(`/api/auth/resetPassword/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.message || 'Unable to reset your password.')
        return
      }

      setSuccess(data?.message || 'Password reset successful.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        <header className="px-8 py-6 bg-slate-50 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-1 text-slate-600">Choose a new password for your account.</p>
        </header>
        <div className="p-8">
          {!token && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">This reset link is missing its token. Request a new one.</p>}
          {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
          {success && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}
          {!success && (
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={!token || submitting}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 disabled:opacity-60"
                />
                <p className="mt-1 text-xs text-slate-500">Use at least 6 characters.</p>
              </div>
              <button
                type="submit"
                disabled={!token || submitting}
                className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
          <Link to="/login" className="mt-6 block text-center text-sm font-medium text-cyan-700 hover:text-cyan-800">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  )
}
