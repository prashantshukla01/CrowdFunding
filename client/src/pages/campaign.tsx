
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Campaign, Contribution, insertContributionSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWeb3 } from "@/lib/web3";
import { useAuth } from "@/lib/firebase";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1591901206069-ed60c4429a2e",
  "https://images.unsplash.com/photo-1591901206025-cf902bf74f22",
  "https://images.unsplash.com/photo-1591901206004-1b3cc4ffbe3c",
  "https://images.unsplash.com/photo-1591901206107-a81f5b57e7f3",
];

export default function CampaignPage() {
  const { id } = useParams();
  const { provider, address } = useWeb3();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const { data: campaign, isLoading: campaignLoading } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${id}`],
  });

  const { data: contributions } = useQuery<Contribution[]>({
    queryKey: [`/api/campaigns/${id}/contributions`],
  });

  const contributeMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!provider || !address || !user?.firebaseUid) {
        throw new Error("Please connect wallet and sign in");
      }

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: campaign?.walletAddress || address,
        value: ethers.parseEther(amount),
      });

      const contribution = {
        userId: Number(user.firebaseUid),
        campaignId: Number(id),
        amount,
        transactionHash: tx.hash,
      };

      await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contribution),
      });

      return tx;
    },
    onSuccess: () => {
      toast({
        title: "Contribution successful",
        description: "Thank you for supporting this campaign!",
      });
      setIsDialogOpen(false);
      setAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (campaignLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">Campaign not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;
  const imageIndex = Number(id) % CAMPAIGN_IMAGES.length;

  const handleContribute = async () => {
    try {
      if (!amount) return;
      
      insertContributionSchema.parse({
        amount,
        userId: Number(user?.firebaseUid),
        campaignId: Number(id),
      });

      await contributeMutation.mutateAsync(amount);
    } catch (error) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-10"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={campaign.image || CAMPAIGN_IMAGES[imageIndex]}
            alt={campaign.title}
            className="w-full aspect-video object-cover rounded-lg shadow-md"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold tracking-tight mb-4">{campaign.title}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Campaign Progress</CardTitle>
                <CardDescription>
                  Help us reach our goal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Raised</span>
                    <span className="font-medium">{campaign.currentAmount} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Goal</span>
                    <span className="font-medium">{campaign.fundingGoal} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setIsDialogOpen(true)}
                  disabled={!user || !address}
                >
                  {!user ? "Sign in to contribute" : !address ? "Connect wallet to contribute" : "Contribute Now"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributions?.map((contribution) => (
                    <motion.div
                      key={contribution.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                    >
                      <div className="text-sm">
                        <div className="font-medium">Anonymous</div>
                        <div className="text-muted-foreground">
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-medium">
                        {contribution.amount} ETH
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribute to {campaign.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (ETH)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in ETH"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleContribute} disabled={contributeMutation.isPending}>
              {contributeMutation.isPending ? "Contributing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
