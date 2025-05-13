import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: 'inventory',
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📂 Database Name: ${conn.connection.name}`)
    console.log(
      `🔌 Connection State: ${
        mongoose.connection.readyState === 1
          ? '🟢 Connected'
          : '🔴 Disconnected'
      }`
    )
  } catch (error) {
    console.error(
      `❌ Error: ${error instanceof Error ? error.message : String(error)}`
    )
    console.error('🚫 Database connection failed')
    process.exit(1)
  }
}

export default connectDB
