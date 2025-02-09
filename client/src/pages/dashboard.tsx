import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/firebase";
import { Campaign, Contribution } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: [`/api/users/${user?.uid}/campaigns`],
    enabled: !!user
  });

  const { data: contributions } = useQuery<Contribution[]>({
    queryKey: [`/api/users/${user?.uid}/contributions`],
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your campaigns and view your contributions
          </p>
        </div>

        <Tabs defaultValue="campaigns">
          <TabsList>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="contributions">My Contributions</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns?.map((campaign) => {
                const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;
                
                return (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle>{campaign.title}</CardTitle>
                      <Progress value={progress} className="mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Raised</span>
                          <span>{campaign.currentAmount} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Goal</span>
                          <span>{campaign.fundingGoal} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status</span>
                          <span className="capitalize">{campaign.status}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="contributions">
            <div className="space-y-4">
              {contributions?.map((contribution) => (
                <Card key={contribution.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <Link href={`/campaign/${contribution.campaignId}`}>
                          Campaign #{contribution.campaignId}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{contribution.amount} ETH</div>
                        <a 
                          href={`https://etherscan.io/tx/${contribution.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View Transaction
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
