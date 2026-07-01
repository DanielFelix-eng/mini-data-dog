import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'
import { errorResponse } from '../utils/response.js'

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorized. No token', 401)
    }

    const token = auth.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) return errorResponse(res, 'User not found', 401)

    req.user = user
    next()
  } catch (error) {
    return errorResponse(res, 'Not authorized. Invalid token', 401)
  }
}

export default protect

