import { users, campaigns, contributions, type User, type Campaign, type Contribution, type InsertUser, type InsertCampaign, type InsertContribution } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private contributions: Map<number, Contribution>;
  private currentId: { users: number; campaigns: number; contributions: number };

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.contributions = new Map();
    this.currentId = { users: 1, campaigns: 1, contributions: 1 };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === uid);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error('User not found');
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Campaign methods
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByUser(userId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values())
      .filter(campaign => campaign.userId === userId);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentId.campaigns++;
    const newCampaign: Campaign = {
      ...campaign,
      id,
      currentAmount: "0",
      status: "active",
      createdAt: new Date()
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.getCampaign(id);
    if (!campaign) throw new Error('Campaign not found');
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Contribution methods
  async getContribution(id: number): Promise<Contribution | undefined> {
    return this.contributions.get(id);
  }

  async getContributionsByUser(userId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values())
      .filter(contribution => contribution.userId === userId);
  }

  async getContributionsByCampaign(campaignId: number): Promise<Contribution[]> {
    return Array.from(this.contributions.values())
      .filter(contribution => contribution.campaignId === campaignId);
  }

  async createContribution(contribution: InsertContribution): Promise<Contribution> {
    const id = this.currentId.contributions++;
    const newContribution: Contribution = {
      ...contribution,
      id,
      createdAt: new Date()
    };
    this.contributions.set(id, newContribution);
    
    // Update campaign amount
    const campaign = await this.getCampaign(contribution.campaignId);
    if (campaign) {
      const newAmount = (BigInt(campaign.currentAmount) + BigInt(contribution.amount)).toString();
      await this.updateCampaign(campaign.id, { currentAmount: newAmount });
    }
    
    return newContribution;
  }
}

export const storage = new MemStorage();
