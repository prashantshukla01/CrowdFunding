import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/firebase";
import { Campaign, Contribution } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Wallet } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: campaigns } = useQuery<Campaign[]>({
    queryKey: [`/api/users/${user?.firebaseUid}/campaigns`],
    enabled: !!user
  });

  const { data: contributions } = useQuery<Contribution[]>({
    queryKey: [`/api/users/${user?.firebaseUid}/contributions`],
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A004E] via-[#500073] to-[#C62300] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <Link href="/sign-in" className="text-lg text-center block">
              Please sign in to view your dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A004E] via-[#500073] to-[#C62300]">
      <div className="container py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user.displayName}
            </h1>
            <p className="text-white/80">
              Manage your campaigns and view your contributions
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#F14A00]" />
                    Total Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {campaigns?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#F14A00]" />
                    Total Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {contributions?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#F14A00]" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {contributions?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0} ETH
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="glass-card">
            <CardContent className="p-6">
              <Tabs defaultValue="campaigns" className="w-full">
                <TabsList>
                  <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
                  <TabsTrigger value="contributions">My Contributions</TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns">
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6"
                  >
                    {campaigns?.map((campaign) => {
                      const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;

                      return (
                        <motion.div key={campaign.id} variants={item}>
                          <Card className="card-hover">
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
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </TabsContent>

                <TabsContent value="contributions">
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4 mt-6"
                  >
                    {contributions?.map((contribution) => (
                      <motion.div key={contribution.id} variants={item}>
                        <Card className="card-hover">
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
                                  className="text-sm text-[#F14A00] hover:underline"
                                >
                                  View Transaction
                                </a>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}