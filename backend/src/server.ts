import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import mongoose from "mongoose";
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

const GRAPHQL_CACHE_TTL = 3600;

async function startServer() {
  await redisService.connect();

  const app: Express = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        process.env.FRONTEND_URL,
      ],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(authMiddleware);

  const httpServer = createServer(app);

  const io = setupSocketIO(httpServer);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

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
            async willSendResponse({ response }) {
              if (response.http) {
                response.http.headers.set(
                  "Cache-Control",
                  `max-age=${GRAPHQL_CACHE_TTL}`
                );
              }
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
    console.log(`🚀 Socket.IO ready at ws://localhost:${PORT}`);
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
