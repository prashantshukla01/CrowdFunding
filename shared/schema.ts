import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  profilePic: text("profile_pic").notNull().default(''),
  walletAddress: text("wallet_address").notNull().default(''),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fundingGoal: text("funding_goal").notNull(), // Store as string for high precision
  currentAmount: text("current_amount").notNull().default("0"),
  image: text("image").notNull().default(''),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata").notNull().default({})
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  amount: text("amount").notNull(),
  transactionHash: text("transaction_hash").notNull().default(''),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({ 
  id: true, 
  currentAmount: true,
  createdAt: true,
  status: true 
});

export const insertContributionSchema = createInsertSchema(contributions).omit({ 
  id: true,
  createdAt: true 
});

export type User = typeof users.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertContribution = z.infer<typeof insertContributionSchema>;