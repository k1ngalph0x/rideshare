import { AuthenticationError, UserInputError } from "apollo-server-express";
import { User } from "../../models/User";
import { generateToken } from "../../utils/auth";
import { redisService } from "../../services/redis.service";
import bcrypt from "bcryptjs";

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

    // updateUser: async (
    //   _: any,
    //   { username }: { username: string },
    //   { user }
    // ) => {
    //   if (!user) throw new AuthenticationError("Not authenticated");

    //   const updatedUser = await User.findByIdAndUpdate(
    //     user.id,
    //     { username },
    //     { new: true }
    //   );

    //   if (!updatedUser) throw new UserInputError("User not found");
    //   return updatedUser;
    // },
    updateUser: async (_: any, { input }: { input: any }, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");

      const currentUser = await User.findById(user.id);
      if (!currentUser) throw new UserInputError("User not found");

      const updateData: any = {};

      if (input.email && input.email !== currentUser.email) {
        const emailExists = await User.findOne({
          email: input.email,
          _id: { $ne: user.id },
        });
        if (emailExists) {
          throw new UserInputError("Email already in use");
        }
        updateData.email = input.email;
      }

      if (input.username) {
        updateData.username = input.username;
      }

      if (input.newPassword) {
        if (!input.currentPassword) {
          throw new UserInputError(
            "Current password is required to set new password"
          );
        }

        const validPassword = await currentUser.comparePassword(
          input.currentPassword
        );
        if (!validPassword) {
          throw new UserInputError("Current password is incorrect");
        }

        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(input.newPassword, salt);
      }

      try {
        if (Object.keys(updateData).length > 0) {
          const updatedUser = await User.findByIdAndUpdate(
            user.id,
            updateData,
            {
              new: true,
              runValidators: true,
            }
          );

          if (!updatedUser) throw new UserInputError("User not found");
          return updatedUser;
        }

        return currentUser; // Return current user if no changes
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },

    deleteUser: async (_: any, __: any, { user }) => {
      if (!user) throw new AuthenticationError("Not authenticated");
      await User.findByIdAndDelete(user.id);
      return true;
    },
  },
};
