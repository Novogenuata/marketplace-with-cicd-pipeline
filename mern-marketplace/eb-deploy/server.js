import app from './express'
import mongoose from 'mongoose'
import config from './../config/config'
import bidding from './controllers/bidding.controller'

// Connect to MongoDB
mongoose.Promise = global.Promise
mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err)
})

// Start server
const PORT = process.env.PORT || config.port || 8080
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})

// Optional: WebSocket / bidding setup
if (bidding) bidding(server)

// Global error handling
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
})

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err)
})
