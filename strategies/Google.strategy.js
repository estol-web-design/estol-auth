import { Strategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { generateUniqueUsername } from "../utils/usernameGenerator.util.js";

const GoogleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleID: profile.id });

      if (!user) {
        const usernameExists = await User.exists({
          username: profile.displayName.toLowerCase().replace(/ /g, "_"),
        });

        user = await User.create({
          googleID: profile.id,
          email: profile.emails[0].value,
          username: usernameExists
            ? generateUniqueUsername(profile.displayName)
            : profile.displayName,
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

export default GoogleStrategy;
