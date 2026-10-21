import mongoose from 'mongoose'

let connectionPromise

export const connectedDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in environment variables')
  }

  if (
    !connectionPromise ||
    mongoose.connection.readyState === 0 ||
    mongoose.connection.readyState === 3
  ) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then((connection) => {
        console.log(`Connected to MongoDB: ${connection.connection.host}`)
        return connection
      })
      .catch((error) => {
        connectionPromise = undefined
        throw error
      })
  }

  return connectionPromise
}
 