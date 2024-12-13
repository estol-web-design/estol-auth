# Estol Auth

Estol Auth is a package designed to handle user authentication in Node.js applications. Its primary purpose is to simplify and standardize the authentication flow, allowing developers to easily integrate it into their projects without implementing it from scratch.

## Key Features

This package provides access to the following functionalities:

```javascript
const estolAuth = {
  auth: passport,
  User,
  register,
  isAuthenticated,
  signMiddleware,
};

export default estolAuth;
```

- **auth**: A renamed instance of Passport with preconfigured methods for user authentication. Developers should integrate it into their projects as they would with Passport, including express-session. For example:

```javascript
app.use(estolAuth.auth.initialize());
app.use(estolAuth.auth.session());
```

- **User**: The user model provided by the package. It includes:
  - `username`: Required, unique string.
  - `email`: Required, unique string with a valid email format.
  - `password`, `googleID`, `microsoftID`: At least one of these fields must be present. If one is defined, the others become optional (`required: false`).
  - `pre-save` function: Encrypts passwords for local authentications.
  - `comparePassword` function: Compares passwords during local authentication.

Here is the complete implementation of the User model:

```javascript
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return v.length >= 3;
        },
        message: "username must have at least 3 characters long",
      },
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: function () {
        if (!this.googleID && !this.microsoftID) return true;
        return false;
      },
    },
    googleID: {
      type: String,
      required: function () {
        if (!this.password && !this.microsoftID) return true;
        return false;
      },
    },
    microsoftID: {
      type: String,
      required: function () {
        if (!this.password && !this.googleID) return true;
        return false;
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = model("User", UserSchema);

export default User;
```

- **register**: A function to register new users locally. It requires the client to send:
  - `username`
  - `email`
  - `password`
  Upon successful registration, the user is automatically authenticated, a session is created, and the necessary cookie is sent to the client.
  Example usage in the authentication controller:

```javascript
register: async (req, res) => {
    const { email, password, username } = req.body;

    try {
      const user = await register({ data: { email, password, username } });

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        return res
          .status(201)
          .json({ success: true, message: "User successfully registered" });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
```

- **isAuthenticated**: Middleware to protect routes, ensuring only authenticated users can access them.

- **signMiddleware**: A method to log in already registered users locally. The client must send:
  - `username` (this can be either the username or email, but the field name must be `username`)
  - `password`

Example route setup in the client project:

```javascript
import { Router } from "express";
import estolAuth from "estol-auth";
import AuthController from "../controllers/Auth.controller.js";

const { isAuthenticated, signMiddleware } = estolAuth;

const AuthRouter = Router();

AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/login", signMiddleware);
AuthRouter.post("/logout", isAuthenticated, AuthController.logout);

export default AuthRouter;
```

## Technologies

- Node.js
- Mongoose
- Passport
- Bcrypt

## Installation and Usage

Currently, the package can be installed directly from GitHub:

```bash
npm install https://github.com/estol-web-design/estol-studio.git
```

In the future, it will be available on npm for easier installation:

```bash
npm install estol-auth
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

