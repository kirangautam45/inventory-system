import { Document } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      user?: IUser & Document
      userId?: string
    }
  }
}

export type CustomJwtPayload = {
  userId: string
  email: string
  role: string
}

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  passwordHash: string
}
