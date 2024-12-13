import passport from "passport";
import LocalStrategy from "../strategies/Local.strategy.js";
import GoogleStrategy from "../strategies/Google.strategy.js";
import MicrosoftStratery from "../strategies/Microsoft.strategy.js";
import User from "../models/user.model.js";

passport.use(LocalStrategy);
passport.use(GoogleStrategy);
passport.use(MicrosoftStratery);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    let usr = await User.findById(id);

    if (usr.password) {
      const { password, user } = usr;
      return done(null, user);
    }

    return done(null, usr);
  } catch (err) {
    done(err);
  }
});

export default passport;