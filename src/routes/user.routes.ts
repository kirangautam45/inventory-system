import { Router } from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller' // Make sure the path is correct

const router = Router()

// POST /api/users - Create a new user
router.post('/', createUser)

// GET /api/users - Get all users
router.get('/', getAllUsers)

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById)

// PUT /api/users/:id - Update user by ID
router.put('/:id', updateUser)

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', deleteUser)

export default router
