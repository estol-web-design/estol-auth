import { Strategy } from "passport-local";
import User from "../models/user.model.js";

const LocalStrategy = new Strategy(async (userData, password, done) => {
  try {
    const usr = await User.findOne({
      $or: [{ email: userData }, { username: userData }],
    });

    if (!usr) return done(null, false, { message: "User not registered" });

    if (!(await usr.comparePassword(password)))
      return done(null, false, { message: "Invalid credentials" });

    const { password: userPassword, ...user } = usr;

    return done(null, user);
  } catch (err) {
    done(err);
  }
});

export default LocalStrategy;
