import { Request, Response } from 'express'
import User from '../models/user.model'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/auth.utils'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields required' })
      return
    }

    const existing = await User.findOne({ email })
    if (existing) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, passwordHash })
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res
      .status(201)
      .json({ user: { id: user._id, name, email, role: user.role }, token })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Registration failed', error: (error as Error).message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res.json({ message: 'Login successful', token })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Login failed', error: (error as Error).message })
  }
}

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json({ user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user', error: (error as Error).message })
  }
}
