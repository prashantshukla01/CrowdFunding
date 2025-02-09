import { useWeb3 } from "@/lib/web3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wallet2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConnectWallet() {
  const { address, connect, disconnect, loading, error } = useWeb3();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your Web3 wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A004E] via-[#500073] to-[#C62300] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white space-y-6 p-8"
        >
          <h1 className="text-5xl font-bold">
            Connect Your Wallet
          </h1>
          <p className="text-xl text-white/80">
            Link your Web3 wallet to start contributing to campaigns and tracking your donations on the blockchain.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F14A00] flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold">Quick Setup</h3>
                <p className="text-sm text-white/70">Connect in just a few clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F14A00] flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold">Secure Connection</h3>
                <p className="text-sm text-white/70">Your keys, your crypto</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl gradient-text">Wallet Status</CardTitle>
              <CardDescription>
                {address ? "Your wallet is connected" : "Connect your wallet to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {address ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">Connected Address</p>
                    <p className="text-xs text-muted-foreground break-all">
                      {address}
                    </p>
                  </div>
                  <Button 
                    onClick={disconnect}
                    variant="outline"
                    className="w-full"
                  >
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleConnect}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2A004E] to-[#500073] hover:from-[#500073] hover:to-[#2A004E]"
                >
                  <Wallet2 className="mr-2 h-4 w-4" />
                  {loading ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error.message}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>Don't have a Web3 wallet?</p>
                <a 
                  href="https://metamask.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#F14A00] hover:underline"
                >
                  Install MetaMask →
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
