import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        setError(data?.message || 'Unable to send a password reset email.')
        return
      }

      setSuccess(data.message || 'Check your inbox for a password reset link.')
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
          <h1 className="text-2xl font-bold text-slate-900">Forgot your password?</h1>
          <p className="mt-1 text-slate-600">Enter your email and we’ll send you a reset link.</p>
        </header>
        <div className="p-8">
          {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
          {success && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
          <Link to="/login" className="mt-6 block text-center text-sm font-medium text-cyan-700 hover:text-cyan-800">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  )
}
