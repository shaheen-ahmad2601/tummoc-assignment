import express from 'express'
import buildRoutes from './routes/index.js'
import buildDatabase from './database/index.js'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import session from 'express-session'
import path from 'path'


export default async function () {
  const app = express()

  app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: '459193470559-5eqncc3frrmip78m1sesjoufekphghd5.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/auth/google/callback'
      },
      (accessToken, refreshToken, profile, done) => {

        const user = {
          id: profile.id,
          displayName: profile.displayName
        }
        done(null, user)
      }
    )
  )
  app.use(express.json())

  const database = await buildDatabase()

  const context = {
    database,
    passport,
    app
  }

  buildRoutes(context)

  app.use(express.static('public'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd() ,'public', 'index.html'))
  })
  return app
}
