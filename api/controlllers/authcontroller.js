import { signUp as signUpService, login as loginService, updateProfile as updateProfileService, changePassword as changePasswordService, deleteAccount as deleteAccountService } from '../services/authservice.js'
import { successResponse } from '../utils/response.js'

export const signUp = async (req, res, next) => {
  try {
    const data = await signUpService(req.body)
    successResponse(res, data, 'Account created')
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const data = await loginService(req.body)
    successResponse(res, data, 'logged in')
  } catch (error) {
    next(error)
  }
}

export const getMe = (req, res) => successResponse(res, req.user)

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user._id, req.body)
    successResponse(res, user, 'Profile updated')
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    await changePasswordService({
      userId: req.user._id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    })
    successResponse(res, null, 'updated')
  } catch (error) {
    next(error)
  }
}

export const deleteAccount = async (req, res, next) => {
  try {
    await deleteAccountService(req.user._id)
    successResponse(res, null, 'Acccount deleted')
  } catch (error) {
    next(error)
  }
}

