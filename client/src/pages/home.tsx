import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CAMPAIGN_IMAGES = [
  "https://images.unsplash.com/photo-1591901206069-ed60c4429a2e",
  "https://images.unsplash.com/photo-1591901206025-cf902bf74f22",
  "https://images.unsplash.com/photo-1591901206004-1b3cc4ffbe3c",
  "https://images.unsplash.com/photo-1591901206107-a81f5b57e7f3",
];

export default function Home() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({ 
    queryKey: ["/api/campaigns"]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Fund the Future with Transparency
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Yajna Funds uses blockchain technology to ensure your contributions make a real impact
          </p>
          <Button className="mt-6" asChild>
            <Link href="/campaigns">View Campaigns</Link>
          </Button>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Featured Campaigns
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns?.slice(0, 6).map((campaign, i) => {
              const progress = (Number(campaign.currentAmount) / Number(campaign.fundingGoal)) * 100;
              
              return (
                <Card key={campaign.id}>
                  <CardHeader className="p-0">
                    <img
                      src={campaign.image || CAMPAIGN_IMAGES[i % CAMPAIGN_IMAGES.length]}
                      alt={campaign.title}
                      className="aspect-video object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {campaign.description}
                    </p>
                    <Progress value={progress} className="mt-4" />
                    <div className="mt-2 flex justify-between text-sm">
                      <span>
                        {campaign.currentAmount} ETH raised
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/campaign/${campaign.id}`}>View Campaign</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
