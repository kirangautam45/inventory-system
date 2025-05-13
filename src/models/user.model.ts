import { Schema, model } from 'mongoose'
import { IUser } from '../types/user'

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
  passwordHash: { type: String, required: true },
})

export default model<IUser>('User', UserSchema)
