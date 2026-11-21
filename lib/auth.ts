import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("hireloopdb")

export const auth = betterAuth({
  //...

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        input: true,
        defaultValue: "seeker",
      },
      // The admin plugin owns `role` and rejects it when it arrives from the
      // sign-up form. The form sends the picked role as `requestedRole`
      // instead, and the hook below copies it onto `role`.
      requestedRole: {
        type: ["seeker", "recruiter"],
        input: true,
        required: false,
        returned: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          if (
            user.requestedRole === "seeker" ||
            user.requestedRole === "recruiter"
          ) {
            return { data: { role: user.requestedRole } }
          }
        },
      },
    },
  },
  // New accounts are seekers unless they asked to join as a recruiter.
  // (`defaultRole` must be one of the app's roles, not better-auth's "user".)
  plugins: [admin({ defaultRole: "seeker" })],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
