import { useAuth } from "@/lib/firebase";
import { useWeb3 } from "@/lib/web3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const { address, balance } = useWeb3();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile details and public information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Not implemented",
                    description: "Profile picture upload is not yet implemented"
                  });
                }}
              >
                Change Picture
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input 
                id="name" 
                defaultValue={user.displayName || ""} 
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                defaultValue={user.email || ""} 
                disabled 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                toast({
                  title: "Profile updated",
                  description: "Your profile has been updated successfully"
                });
              }}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection</CardTitle>
            <CardDescription>
              Manage your Web3 wallet connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {address ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Connected Address</Label>
                  <Input value={address} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Balance</Label>
                  <Input value={`${balance} ETH`} readOnly />
                </div>
              </div>
            ) : (
              <p>No wallet connected</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.open('https://metamask.io', '_blank')}>
              Learn about Web3 Wallets
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
