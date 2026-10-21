import express from 'express'
import { signup, login, verifyEmail, resendVerification, resetPassword, forgotPassword, googleAuth, checkauth } from '../controlllers/authcontroller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

// Mounted at /api
router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleAuth)
router.post('/verifyEmail', verifyToken, verifyEmail)
router.post('/resendVerification', verifyToken, resendVerification)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPassword)
router.get('/verifyToken', verifyToken, (req, res) => {
     res.status(200).json({ message: 'Token is valid' })
}
)
router.get('/checkauth', verifyToken, checkauth)

export default router
