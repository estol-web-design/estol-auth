import passport from "./config/passport.config.js";
import User from "./models/user.model.js";
import register from "./services/auth.service.js";
import {
  isAuthenticated,
  signMiddleware,
} from "./middlewares/auth.middleware.js";

export {
  passport as estolAuth,
  User,
  register,
  isAuthenticated,
  signMiddleware,
};
