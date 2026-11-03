import jwt from 'jsonwebtoken'

export const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
}

export const generateToken = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    // Make the root cause obvious instead of returning a generic 500
    throw new Error('JWT_SECRET is not set in environment variables')
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' })

  res.cookie('token', token, tokenCookieOptions)

  return token
}


   
 