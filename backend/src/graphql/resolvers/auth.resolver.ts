import { UserInputError } from "apollo-server-express";
import { registerSchema, loginSchema } from "../../validators/auth.validator";
import { User } from "../../models/User";
import { generateToken } from "../../utils/auth";
import { Context } from "../../types/context";

export const authResolvers = {
  Mutation: {
    register: async (_: any, { input }: { input: any }) => {
      try {
        const validatedInput = registerSchema.parse(input);

        const existingUser = await User.findOne({
          email: validatedInput.email,
        });
        if (existingUser) {
          throw new UserInputError("Email already registered");
        }

        const user = await User.create(validatedInput);
        const token = generateToken(user);

        return {
          token,
          user,
        };
      } catch (error) {
        if (error.errors) {
          throw new UserInputError("Validation error", {
            validationErrors: error.errors,
          });
        }
        throw error;
      }
    },

    login: async (_: any, { input }: { input: any }) => {
      try {
        const validatedInput = loginSchema.parse(input);

        const user = await User.findOne({ email: validatedInput.email });
        if (!user) {
          throw new UserInputError("Invalid credentials");
        }

        const validPassword = await user.comparePassword(
          validatedInput.password
        );
        if (!validPassword) {
          throw new UserInputError("Invalid credentials");
        }

        const token = generateToken(user);
        return {
          token,
          user,
        };
      } catch (error) {
        if (error.errors) {
          throw new UserInputError("Validation error", {
            validationErrors: error.errors,
          });
        }
        throw error;
      }
    },
  },

  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) {
        throw new UserInputError("Not authenticated");
      }
      return User.findById(user.id).select("-password");
    },
  },
};
