// export const userTypeDefs = `
//   type User {
//     id: ID!
//     email: String!
//     username: String!
//     createdAt: String!
//     updatedAt: String!
//   }

//   type AuthPayload {
//     token: String!
//     user: User!
//   }

//   input RegisterInput {
//     email: String!
//     username: String!
//     password: String!
//   }

//   input LoginInput {
//     email: String!
//     password: String!
//   }

//   type Query {
//     me: User
//     getUser(id: ID!): User
//     getUsers: [User]!
//   }

//   type Mutation {
//     register(input: RegisterInput!): AuthPayload!
//     login(input: LoginInput!): AuthPayload!
//     updateUser(username: String!): User!
//     deleteUser: Boolean!
//   }

//   type Subscription {
//     userUpdated: User!
//   }
// `;
// src/graphql/schemas/user.schema.ts
export const userTypeDefs = `
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    getUser(id: ID!): User
    getUsers: [User!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(username: String!): User!
    deleteUser: Boolean!
  }
`;
