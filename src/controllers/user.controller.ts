import { Request, Response } from 'express'
import User from '../models/user.model' // Adjust the path if needed
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Reusable error handler
const handleError = (res: Response, error: unknown, statusCode = 500): void => {
  const errorMessage = error instanceof Error ? error.message : 'Server error'
  res.status(statusCode).json({ message: errorMessage })
}

// Validate MongoDB ObjectId
const isValidObjectId = (id: string, res: Response): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid user ID format' })
    return false
  }
  return true
}

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, role, password } = req.body

    console.log(req.body)

    const existingUser = await User.findOne({ email }).select('_id').lean()
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, role, passwordHash })

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error) {
    handleError(res, error)
  }
}

// Get all users
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash')
    res.json(users)
  } catch (error) {
    handleError(res, error)
  }
}

// Get a single user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const user = await User.findById(id).select('-passwordHash')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  } catch (error) {
    handleError(res, error)
  }
}

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, role, password } = req.body
    const { id } = req.params

    if (!isValidObjectId(id, res)) return

    const updateData: Record<string, any> = { name, email, role }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select('-passwordHash')

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({ message: 'User updated', user: updatedUser })
  } catch (error) {
    handleError(res, error)
  }
}

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id, res)) return

    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({ message: 'User deleted' })
  } catch (error) {
    handleError(res, error)
  }
}
