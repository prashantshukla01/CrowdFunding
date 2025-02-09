import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1591901206069-ed60c4429a2e",
  "https://images.unsplash.com/photo-1591901206025-cf902bf74f22",
  "https://images.unsplash.com/photo-1591901206004-1b3cc4ffbe3c",
  "https://images.unsplash.com/photo-1591901206107-a81f5b57e7f3",
];

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

export default function Home() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({ 
    queryKey: ["/api/campaigns"]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A004E] via-[#500073] to-[#C62300]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container py-24"
      >
        <div className="flex flex-col gap-16">
          <section className="text-center max-w-4xl mx-auto px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold tracking-tight text-white mb-8"
            >
              Fund the Future with
              <span className="block text-[#F14A00]">Transparency</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/80 mb-12"
            >
              Yajna Funds uses blockchain technology to ensure your contributions make a real impact
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                className="px-12 py-6 text-lg bg-[#F14A00] hover:bg-[#C62300] transition-colors"
                asChild
              >
                <Link href="/campaigns">Explore Campaigns</Link>
              </Button>
            </motion.div>
          </section>

          <section className="glass-card p-12">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold tracking-tight mb-12 gradient-text"
            >
              Featured Campaigns
            </motion.h2>

            {isLoading ? (
              <div className="campaign-grid">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="p-8">
                      <Skeleton className="h-8 w-3/4 mb-6" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="campaign-grid"
              >
                {campaigns?.slice(0, 6).map((campaign, i) => {
                  const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;

                  return (
                    <motion.div key={campaign.id} variants={item}>
                      <Card className="card-hover overflow-hidden">
                        <CardHeader className="p-0">
                          <img
                            src={campaign.image || CAMPAIGN_IMAGES[i % CAMPAIGN_IMAGES.length]}
                            alt={campaign.title}
                            className="aspect-video object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </CardHeader>
                        <CardContent className="p-8">
                          <CardTitle className="text-2xl mb-4 gradient-text">
                            {campaign.title}
                          </CardTitle>
                          <p className="text-base text-muted-foreground mb-6 line-clamp-2">
                            {campaign.description}
                          </p>
                          <Progress value={progress} className="h-2 mb-4 bg-[#2A004E]/10" />
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-[#C62300]">
                              {campaign.currentAmount} ETH raised
                            </span>
                            <span className="text-[#500073]">{Math.round(progress)}%</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-6 bg-gradient-to-r from-[#2A004E]/5 to-[#500073]/5">
                          <Button 
                            className="w-full bg-gradient-to-r from-[#2A004E] to-[#500073] hover:from-[#500073] hover:to-[#2A004E] transition-all duration-300" 
                            asChild
                          >
                            <Link href={`/campaign/${campaign.id}`}>View Campaign</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}