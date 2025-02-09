import { Link, useLocation } from "wouter";
import { Button } from "./button";
import { useAuth } from "@/lib/firebase";
import { useWeb3 } from "@/lib/web3";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Wallet2 } from "lucide-react";

export function Navbar() {
  const { user, signIn, signOut } = useAuth();
  const { address, connect, disconnect } = useWeb3();
  const [location] = useLocation();

  // Don't show navbar on sign-in page
  if (location === "/sign-in") {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Yajna Funds
            </span>
          </Link>
          <div className="flex gap-6 text-muted-foreground">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/campaigns">Campaigns</Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
            {address ? (
              <Button 
                variant="outline"
                onClick={disconnect}
                className="flex items-center gap-2"
              >
                <Wallet2 className="h-4 w-4" />
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </Button>
            ) : (
              <Button onClick={connect}>
                Connect Wallet
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button variant="outline" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signIn()}
                className="bg-gradient-to-r from-[#2A004E] to-[#500073] hover:from-[#500073] hover:to-[#2A004E]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}