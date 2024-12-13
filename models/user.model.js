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
