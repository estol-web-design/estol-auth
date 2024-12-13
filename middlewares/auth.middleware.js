import passport from "passport";

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: "unauthorized" });
};

export const signMiddleware = (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      throw new Error(err.message);
    }
    if (!user) throw new Error(info.message);
    req.login(user, (err) => {
      if (err) {
        throw new Error(err.message);
      }
      return res.json({
        success: true,
        message: "User logged in",
        user,
      });
    });
  })(req, res, next);
};
