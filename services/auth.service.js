import User from "../models/user.model.js";

const AuthService = {
  register: async ({ data }) => {
    const newUser = await User.create( data );

    return newUser;
  },
};

export default AuthService.register;
