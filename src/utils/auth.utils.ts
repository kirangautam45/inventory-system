import jwt, { SignOptions } from 'jsonwebtoken'
import { CustomJwtPayload, IUser } from '../types/inventory'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

export const generateToken = (payload: CustomJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions)
}

export const verifyToken = (token: string): CustomJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as CustomJwtPayload
}

export const getUserPermissions = async (user: IUser): Promise<string[]> => {
  const roleMap: Record<string, string[]> = {
    admin: ['admin', 'manager', 'staff'],
    manager: ['manager', 'staff'],
    staff: ['staff'],
  }

  return roleMap[user.role] || []
}
