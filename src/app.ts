import express, { Express } from 'express'
import cors from 'cors'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

// 💡 Initialize Express app
const app: Express = express()

// 🛡️ Middleware
app.use(cors())
app.use(express.json())

// 🧭 Routes
app.use('/api/auth', authRoutes)
app.use('/api/v1/user', userRoutes)

// 🏠 Root route
app.get('/', (req, res) => {
  res.send(`
    🚀 API is running...

    🌐 Status: Online
    📅 Uptime: ${Math.floor(process.uptime())} seconds
    
  `)
})

export default app
