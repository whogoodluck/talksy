import { AuthType } from '@prisma/client'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { prisma } from '../lib/prisma'
import { USER_SAFE_FIELDS } from '../services/user.service'
import config from '../utils/config'

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: config.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value

        if (!email) {
          return done(new Error('No email returned from Google'), undefined)
        }

        let user = await prisma.user.findUnique({
          where: { authType: AuthType.GOOGLE, googleId: profile.id },
        })

        if (!user) {
          const existingByEmail = await prisma.user.findUnique({ where: { email } })

          if (existingByEmail) {
            user = await prisma.user.update({
              where: { id: existingByEmail.id },
              data: {
                googleId: profile.id,
                picture: existingByEmail.picture ?? profile.photos?.[0]?.value,
                isEmailVerified: true,
                authType: AuthType.GOOGLE,
              },
              omit: USER_SAFE_FIELDS,
            })
          } else {
            const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
            let username = baseUsername
            const conflict = await prisma.user.findUnique({ where: { username } })
            if (conflict) username = `${baseUsername}_${Math.floor(Math.random() * 9000 + 1000)}`

            user = await prisma.user.create({
              data: {
                email,
                googleId: profile.id,
                name: profile.displayName ?? baseUsername,
                username,
                picture: profile.photos?.[0]?.value ?? null,
                isEmailVerified: true,
                authType: AuthType.GOOGLE,
              },
              omit: USER_SAFE_FIELDS,
            })
          }
        }

        return done(null, user)
      } catch (err) {
        return done(err as Error, undefined)
      }
    }
  )
)

export default passport
