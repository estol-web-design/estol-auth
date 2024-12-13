import { Strategy } from "passport-microsoft";
import User from "../models/user.model.js";
import { generateUniqueUsername } from "../utils/usernameGenerator.util.js";

const MicrosoftStratery = new Strategy(
  {
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: `/auth/microsoft/callback`,
    scope: ["user.read"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ microsoftID: profile.id });

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
      done(err);
    }
  }
);

export default MicrosoftStratery;
