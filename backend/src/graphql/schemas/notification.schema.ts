export const notificationTypeDefs = `
  type Notification {
    id: ID!
    message: String!
    read: Boolean!
    createdAt: String!
  }

  extend type Query {
    notifications: [Notification]!
  }

  extend type Mutation {
    markNotificationRead(id: ID!): Notification!
  }

  type Subscription {
    notificationReceived: Notification!
  }
`;
