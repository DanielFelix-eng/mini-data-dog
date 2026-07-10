import jwt from 'jsonwebtoken'

export const generateToken = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    // Make the root cause obvious instead of returning a generic 500
    throw new Error('JWT_SECRET is not set in environment variables')
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' })

  res.cookie('token', token, {
    httpOnly: true,
    // In dev (http), secure must be false or the cookie won't be stored.
    secure: process.env.NODE_ENV === 'production',
    // Lax is generally the best balance for SPA dev between strictness and reliability.
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  })

  return token
}


   
 