import express from 'express'
import { signup, login, verifyEmail, resendVerification, resetPassword, forgotPassword, googleAuth } from '../controlllers/authcontroller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

// Mounted at /api
router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/verifyEmail', verifyToken, verifyEmail)
router.post('/resendVerification', verifyToken, resendVerification)
router.post('/forgotPassword', verifyToken, forgotPassword)
router.post('/resetPassword', verifyToken, resetPassword)
router.get('/verifyToken', verifyToken, (req, res) => {
     res.status(200).json({ message: 'Token is valid' })
}
)

export default router

