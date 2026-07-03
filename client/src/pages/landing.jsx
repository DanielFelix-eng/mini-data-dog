import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-[var(--border)] bg-white/60 shadow-[var(--shadow)] backdrop-blur p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-[var(--text-h)]">Mini Data Dog</h1>
            <p className="mt-4 text-[var(--text-h)]/85 leading-relaxed">
              Mini Data Dog helps you track and visualise small datasets quickly —
              create an account, verify your email, and start monitoring changes.
              Built with a lightweight React + Vite frontend and a simple Express API.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-cyan-500/90 via-emerald-400/90 to-lime-500/90 px-6 py-3 font-semibold text-[#062012] hover:brightness-105"
              >
                Sign up
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-[var(--border)] bg-white/70 px-6 py-3 font-medium text-[var(--text-h)]"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className="rounded-xl border border-[var(--border)] bg-gradient-to-b from-cyan-50/40 to-green-50/30 p-6 text-center">
              <h3 className="text-lg font-medium text-[var(--text-h)]">Lightweight</h3>
              <p className="mt-2 text-sm text-[var(--text-h)]/80">No heavy setup — start in minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
