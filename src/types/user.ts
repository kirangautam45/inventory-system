import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  passwordHash: string
}
