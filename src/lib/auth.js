import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

let client;
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(process.env.MONGODB_URI);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(process.env.MONGODB_URI);
}

const db = client.db("art-hub");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: "user",
      },
      subscriptionTier: {
        defaultValue: "free",
      },
      purchaseCount: {
        defaultValue: 0,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30,
    },
  },

  plugins: [jwt()],
});
