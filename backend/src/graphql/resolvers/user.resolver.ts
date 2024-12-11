import { AuthenticationError, UserInputError } from "apollo-server-express";
import { User } from "../../models/User";
import { generateToken } from "../../utils/auth";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");
      return User.findById(user.id);
    },

    getUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id);
      if (!user) throw new UserInputError("User not found");
      return user;
    },

    getUsers: async () => {
      return User.find();
    },
  },

  Mutation: {
    register: async (_: any, { input }: { input: any }) => {
      const { email, username, password } = input;

      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new UserInputError("Email already registered");
      }

      const user = await User.create({
        email,
        username,
        password,
      });

      const token = generateToken(user);

      return { token, user };
    },

    login: async (_: any, { input }: { input: any }) => {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError("Invalid credentials");
      }

      const validPassword = await user.comparePassword(password);
      if (!validPassword) {
        throw new UserInputError("Invalid credentials");
      }

      const token = generateToken(user);

      return { token, user };
    },

    updateUser: async (_: any, { input }: { input: any }, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { ...input },
        { new: true }
      );

      if (!updatedUser) throw new UserInputError("User not found");
      return updatedUser;
    },

    deleteUser: async (_: any, __: any, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      await User.findByIdAndDelete(user.id);
      return true;
    },
  },
};
