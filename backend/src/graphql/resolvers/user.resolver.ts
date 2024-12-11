import { AuthenticationError, UserInputError } from "apollo-server-express";
import { User } from "../../models/User";
import { generateToken } from "../../utils/auth";
import { redisService } from "../../services/redis.service";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const userData = await User.findById(user.id);
      if (!userData) throw new UserInputError("User not found");
      return userData;
    },

    getUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id);
      if (!user) throw new UserInputError("User not found");
      return user;
    },

    getUsers: async () => {
      return await User.find();
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

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
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

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    },

    updateUser: async (
      _: any,
      { username }: { username: string },
      { user }
    ) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { username },
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
