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

  const { data: campaign, isLoading: campaignLoading } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${id}`],
  });

  const { data: contributions } = useQuery<Contribution[]>({
    queryKey: [`/api/campaigns/${id}/contributions`],
  });

  const contributeMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!provider || !address || !user) {
        throw new Error("Please connect wallet and sign in");
      }

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: campaign?.userId.toString(), // In production, this would be a smart contract address
        value: ethers.parseEther(amount),
      });

      // Record contribution in our backend
      const contribution = {
        userId: user.id,
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
        <div>Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-10">
        <div>Campaign not found</div>
      </div>
    );
  }

  const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;
  const imageIndex = Number(id) % CAMPAIGN_IMAGES.length;

  const handleContribute = async () => {
    const amount = prompt("Enter amount in ETH:");
    if (!amount) return;

    try {
      insertContributionSchema.parse({
        amount,
        userId: user?.id,
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
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <img
            src={campaign.image || CAMPAIGN_IMAGES[imageIndex]}
            alt={campaign.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{campaign.title}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Progress</CardTitle>
              <CardDescription>
                Help us reach our goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} />
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
                onClick={handleContribute}
                disabled={!user || !address || contributeMutation.isPending}
              >
                {contributeMutation.isPending ? "Contributing..." : "Contribute Now"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contributions?.map((contribution) => (
                  <div key={contribution.id} className="flex justify-between items-center">
                    <div className="text-sm">
                      <div className="font-medium">Anonymous</div>
                      <div className="text-muted-foreground">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-medium">
                      {contribution.amount} ETH
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
