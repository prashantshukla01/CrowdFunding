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
    <div className="min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container py-16"
      >
        <div className="flex flex-col gap-12">
          <section className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            >
              Fund the Future with Transparency
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground"
            >
              Yajna Funds uses blockchain technology to ensure your contributions make a real impact
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button className="mt-8 px-8 py-6 text-lg" asChild>
                <Link href="/campaigns">Explore Campaigns</Link>
              </Button>
            </motion.div>
          </section>

          <section>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight mb-8"
            >
              Featured Campaigns
            </motion.h2>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 w-full" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
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
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {campaigns?.slice(0, 6).map((campaign, i) => {
                  const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;

                  return (
                    <motion.div key={campaign.id} variants={item}>
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="p-0">
                          <img
                            src={campaign.image || CAMPAIGN_IMAGES[i % CAMPAIGN_IMAGES.length]}
                            alt={campaign.title}
                            className="aspect-video object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </CardHeader>
                        <CardContent className="p-6">
                          <CardTitle className="line-clamp-1 text-xl mb-2">
                            {campaign.title}
                          </CardTitle>
                          <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                            {campaign.description}
                          </p>
                          <Progress value={progress} className="h-2 mb-4" />
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-primary">
                              {campaign.currentAmount} ETH raised
                            </span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50">
                          <Button className="w-full" variant="secondary" asChild>
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