import { createToken } from '../../utility/encryption.js'


export default function (database) {
  return async (req, res) => {
    const { usersModel } = database

    try {
      const rawUser = await usersModel.findOne({ email: req.body.email })

      if (!rawUser) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      const match = rawUser.checkPassword(req.body.password)

      if (!match) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      const user = fixJson(rawUser)

      const token = createToken(user)

      res.status(200).json({ user, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  }
}

/**
 * Helper function to fix JSON serialization/deserialization issues.
 * Converts an object to JSON and then parses it back to ensure it's a plain JavaScript object.
 * @param {Object} object - Object to be fixed
 * @returns {Object} - Fixed object
 */
const fixJson = (object) => JSON.parse(JSON.stringify(object))
