import { Request, Response, NextFunction } from 'express'
import { getUserPermissions, verifyToken } from '../utils/auth.utils'
import User from '../models/user.model'
import { IUser } from '../types/inventory'
import { Document } from 'mongoose'



export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.userId)

    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    req.user = user
    req.userId = user._id.toString()

    next()
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Invalid token', error: (error as Error).message })
    return
  }
}

/**
 * Generic RBAC Middleware with async role/permission check and optional logging
 * @param requiredRoles - array of allowed roles
 * @param options.log - enable request logging
 */
export const authorize = (
  requiredRoles: string[] = [],
  options: { log?: boolean } = { log: true }
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const log = options?.log
    try {
      if (log) {
        console.log(`[RBAC] Checking permissions for user: ${req.user?.email}`)
      }

      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized: User not found' })
        return
      }

      const userPermissions = await getUserPermissions(req.user)

      if (log) {
        console.log(`[RBAC] User role: ${req.user.role}`)
        console.log(`[RBAC] Required: ${requiredRoles.join(', ')}`)
        console.log(`[RBAC] User permissions: ${userPermissions.join(', ')}`)
      }

      const hasAccess = requiredRoles.some((role) =>
        userPermissions.includes(role)
      )

      if (!hasAccess) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
        return
      }

      next()
    } catch (error) {
      console.error('[RBAC] Error in authorization middleware:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
