import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    groupId: v.optional(v.id("groups")),
  }),
});
