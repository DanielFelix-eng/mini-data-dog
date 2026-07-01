import express from 'express'
import { signUp, login } from '../controlllers/authcontroller.js'

const router = express.Router()

// Mounted at /api
router.post('/signup', signUp)
router.post('/login', login)

export default router

