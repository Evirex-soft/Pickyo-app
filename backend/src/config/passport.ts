import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/oauth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error('No email found from Google'));
        }
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create user
        const newUser = await prisma.user.create({
          data: {
            name: profile.displayName,
            email,
            googleId: profile.id,
            isProfileComplete: false,
            phone: null,
          },
        });
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
