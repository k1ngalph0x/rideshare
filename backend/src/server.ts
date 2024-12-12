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
import { setupSocketIO } from "./config/socket";
import { redisService } from "./services/redis.service";

dotenv.config();

const GRAPHQL_CACHE_TTL = 3600; // 1 hour

async function startServer() {
  // Initialize Redis connection
  await redisService.connect();

  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  const httpServer = createServer(app);
  const io = setupSocketIO(httpServer);

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
      io,
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async requestDidStart() {
          return {
            async willSendResponse({ response, context }) {
              // Add cache headers
              if (response.http) {
                response.http.headers.set(
                  "Cache-Control",
                  `max-age=${GRAPHQL_CACHE_TTL}`
                );
              }
            },
            async didEncounterErrors({ errors }) {
              console.error("GraphQL Errors:", errors);
            },
          };
        },
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();

  await server.applyMiddleware({
    app: app as any,
    path: "/graphql",
  });

  //   try {
  //     await mongoose.connect(process.env.MONGODB_URI!);
  //     console.log("Connected to MongoDB");
  //   } catch (error) {
  //     console.error("MongoDB connection error:", error);
  //     process.exit(1);
  //   }
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

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Performing graceful shutdown...");
  await redisService.disconnect();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Server start error:", error);
  process.exit(1);
});
