import { gql } from "apollo-server-express";
import { userTypeDefs } from "./user.schema";

export const typeDefs = gql`
  ${userTypeDefs}
`;
