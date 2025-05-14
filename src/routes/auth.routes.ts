import { Router } from 'express'
import {
  register,
  login,
  getCurrentUser,
  getProfile,
} from '../controllers/auth.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getCurrentUser)
router.get('/profile', authenticate, getProfile)

// Only admin can access this
router.get('/admin-data', authenticate, authorize(['admin']), (_req, res) => {
  res.json({ message: 'Admin-only content' })
})

// Only manager or admin can access this
router.get(
  '/manager-data',
  authenticate,
  authorize(['manager']),
  (_req, res) => {
    res.json({ message: 'Manager/Admin content' })
  }
)

router.get('/staff-data', authenticate, authorize(['staff']), (_req, res) => {
  res.json({ message: 'staff/Manager/Admin content' })
})

export default router
