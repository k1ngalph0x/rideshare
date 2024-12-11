import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./graphql/schemas";
import { resolvers } from "./graphql/resolvers";
import { authMiddleware, AuthRequest } from "./middleware/auth.middleware";

dotenv.config();

async function startServer() {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        return { user: null };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }: { req: AuthRequest }) => ({
      user: req.user || null,
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  await server.applyMiddleware({
    app: app as any,
    path: "/graphql",
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

startServer().catch((error) => {
  console.error("Server start error:", error);
  process.exit(1);
});
