import buildApp from './src/app.js'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config();

(async function start () {
  try {
    // Build the Express application
    const app = await buildApp()

    // Start listening on the specified port
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to start the application:', error)
  }
})()
