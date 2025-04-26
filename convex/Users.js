import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("ARGS RECEIVED:", args);
    if (!args || Object.keys(args).length === 0) {
      throw new Error("Missing or invalid arguments for user creation");
    }

    const { name, phone, email, passwordHash } = args;

    if (!name || !phone || !email || !passwordHash) {
      throw new Error("Missing required fields for user creation");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .collect();

    if (user?.length === 0) {
      const data = {
        name,
        phone,
        email,
        passwordHash,
        role: "user",
      };
      const newUser = await ctx.db.insert("users", {
        ...data,
      });
      console.log("New user created:", newUser);
      return data;
    }

    return user[0];
  },
});

export const GetUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    return user[0] || null;
  },
});
