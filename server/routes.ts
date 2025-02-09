import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertContributionSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Campaigns
  app.get("/api/campaigns", async (req, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    const campaign = await storage.getCampaign(Number(req.params.id));
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }
    res.json(campaign);
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaign = insertCampaignSchema.parse(req.body);
      const created = await storage.createCampaign(campaign);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  // Contributions
  app.post("/api/contributions", async (req, res) => {
    try {
      const contribution = insertContributionSchema.parse(req.body);
      const created = await storage.createContribution(contribution);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contribution data", errors: error.errors });
        return;
      }
      throw error;
    }
  });

  app.get("/api/campaigns/:id/contributions", async (req, res) => {
    const contributions = await storage.getContributionsByCampaign(Number(req.params.id));
    res.json(contributions);
  });

  app.get("/api/users/:id/contributions", async (req, res) => {
    const contributions = await storage.getContributionsByUser(Number(req.params.id));
    res.json(contributions);
  });

  // Users
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  app.get("/api/users/firebase/:uid", async (req, res) => {
    const user = await storage.getUserByFirebaseUid(req.params.uid);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  const httpServer = createServer(app);
  return httpServer;
}
