import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../env.js";
import { insertUser } from "../repo/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value,
        };

        await insertUser(user);

        const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });

        return done(null, { user, token });
      }
      catch (err) {
        console.error("❌ Google Strategy Error:", err);
        return done(err, null);
      }
    },
  ),
);

export default passport;
