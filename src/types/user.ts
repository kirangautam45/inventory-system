import { Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  passwordHash: string
}
