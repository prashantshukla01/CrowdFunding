import { users, campaigns, contributions, type User, type Campaign, type Contribution, type InsertUser, type InsertCampaign, type InsertContribution } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Campaigns
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaigns(): Promise<Campaign[]>;
  getCampaignsByUser(userId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign>;

  // Contributions
  getContribution(id: number): Promise<Contribution | undefined>;
  getContributionsByUser(userId: number): Promise<Contribution[]>;
  getContributionsByCampaign(campaignId: number): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, uid));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // Campaigns
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaignsByUser(userId: number): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const [updated] = await db
      .update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  // Contributions
  async getContribution(id: number): Promise<Contribution | undefined> {
    const [contribution] = await db.select().from(contributions).where(eq(contributions.id, id));
    return contribution;
  }

  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    if (!userId || isNaN(userId)) {
      return [];
    }
    return await db.select().from(contributions).where(eq(contributions.userId, userId));
  }

  async getContributionsByCampaign(campaignId: number): Promise<Contribution[]> {
    return await db.select().from(contributions).where(eq(contributions.campaignId, campaignId));
  }

  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const [newContribution] = await db.insert(contributions).values(contribution).returning();

    // Update campaign amount
    const campaign = await this.getCampaign(contribution.campaignId);
    if (campaign) {
      const newAmount = (BigInt(campaign.currentAmount) + BigInt(contribution.amount)).toString();
      await this.updateCampaign(campaign.id, { currentAmount: newAmount });
    }

    return newContribution;
  }
}

export const storage = new DatabaseStorage();