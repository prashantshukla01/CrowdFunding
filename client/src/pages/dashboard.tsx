import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/firebase";
import { Campaign, Contribution } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Wallet, Plus, ExternalLink, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const totalValue = contributions?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;
  const completedCampaigns = campaigns?.filter(c => c.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A004E] via-[#500073] to-[#C62300]">
      <div className="container py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome back, {user.displayName}
              </h1>
              <p className="text-white/80">
                Manage your campaigns and track your contributions
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                asChild
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Link href="/connect-wallet">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Link>
              </Button>
              <Button 
                asChild
                className="bg-[#F14A00] hover:bg-[#C62300] transition-colors"
              >
                <Link href="/campaigns/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#F14A00]" />
                    Active Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {activeCampaigns}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedCampaigns} campaigns completed
                  </p>
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
                  <p className="text-sm text-muted-foreground">
                    Across {campaigns?.length || 0} campaigns
                  </p>
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
                    {totalValue.toFixed(2)} ETH
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ≈ ${(totalValue * 2500).toLocaleString()} USD
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#F14A00]" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gradient-text">
                    {contributions?.slice(-7).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contributions this week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Card className="glass-card">
            <CardContent className="p-6">
              <Tabs defaultValue="campaigns" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="campaigns" className="flex-1">My Campaigns</TabsTrigger>
                  <TabsTrigger value="contributions" className="flex-1">My Contributions</TabsTrigger>
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
                              <CardTitle className="flex items-center justify-between">
                                <span className="gradient-text">{campaign.title}</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${
                                  campaign.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {campaign.status}
                                </span>
                              </CardTitle>
                              <Progress value={progress} className="mt-2" />
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between">
                                  <span>Raised</span>
                                  <span className="font-medium">{campaign.currentAmount} ETH</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Goal</span>
                                  <span className="font-medium">{campaign.fundingGoal} ETH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Created</span>
                                  <span className="text-muted-foreground">
                                    {new Date(campaign.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="w-full mt-4"
                                  asChild
                                >
                                  <Link href={`/campaign/${campaign.id}`}>
                                    View Details 
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
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
                              <div className="space-y-1">
                                <Link 
                                  href={`/campaign/${contribution.campaignId}`}
                                  className="text-lg font-medium hover:underline"
                                >
                                  Campaign #{contribution.campaignId}
                                </Link>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {new Date(contribution.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right space-y-1">
                                <div className="text-xl font-medium gradient-text">
                                  {contribution.amount} ETH
                                </div>
                                <a 
                                  href={`https://etherscan.io/tx/${contribution.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[#F14A00] hover:underline inline-flex items-center"
                                >
                                  View Transaction
                                  <ExternalLink className="ml-1 h-3 w-3" />
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