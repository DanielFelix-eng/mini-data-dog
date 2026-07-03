import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../slices/authSlice.js'

export default function Oauth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      console.log('Firebase auth result:', result)

      const { user } = result
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        }),
      })

      const data = await response.json()
      if (data.success) {
        console.log('Google auth successful:', data)
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        dispatch(loginSuccess({ user: data.user, token: data.token }))
        navigate('/')
      } else {
        console.error('Google auth failed:', data.message)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950 px-8 py-6 text-center">
      <p className="mb-4 text-sm text-slate-400">Or continue with</p>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="inline-flex items-center justify-center w-full gap-3 rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
          <svg viewBox="0 0 533.5 544.3" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M533.5 278.4c0-18.3-1.5-36-4.3-53.2H272v100.7h146.9c-6.4 34.7-25.9 64.1-55 83.8v69.6h88.8c52.1-48 82-118.6 82-201z"/>
            <path fill="#34A853" d="M272 544.3c74 0 136-24.6 181.4-66.7l-88.8-69.6c-24.6 16.5-56 26.1-92.6 26.1-71 0-131.2-47.9-152.8-112.5H29.8v70.6C74.4 485.1 167 544.3 272 544.3z"/>
            <path fill="#FBBC05" d="M119.2 325.6c-8.6-25.6-8.6-53.3 0-78.9V176.1H29.8c-44.4 88.7-44.4 192.8 0 281.5l89.4-70z"/>
            <path fill="#EA4335" d="M272 107.7c39.2 0 74.6 13.5 102.4 39.8l76.8-76.8C407.6 24.7 346 0 272 0 167 0 74.4 59.2 29.8 146.1l89.4 70C140.8 155.6 201 107.7 272 107.7z"/>
          </svg>
        </span>
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>
    </div>
  )
}
