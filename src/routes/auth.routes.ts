import { Router } from 'express'
import { register, login, getCurrentUser } from '../controllers/auth.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getCurrentUser)

// Only admin can access this
router.get('/admin-data', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin-only content' })
})

// Only manager or admin can access this
router.get(
  '/manager-data',
  authenticate,
  authorize(['admin', 'manager']),
  (req, res) => {
    res.json({ message: 'Manager/Admin content' })
  }
)

// Any authenticated user can access this
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Hello, ${req.user?.name}` })
})

export default router
