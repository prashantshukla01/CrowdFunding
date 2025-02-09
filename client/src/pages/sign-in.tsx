import { useAuth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Redirect } from "wouter";
import { SiGoogle } from "react-icons/si";

export default function SignIn() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Redirect to="/dashboard" />;
  }

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
            Welcome to Yajna Funds
          </h1>
          <p className="text-xl text-white/80">
            Join our community of changemakers and support meaningful projects through transparent blockchain technology.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F14A00] flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold">Secure Authentication</h3>
                <p className="text-sm text-white/70">Powered by Google Firebase</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F14A00] flex items-center justify-center">
                <span className="text-2xl">⛓️</span>
              </div>
              <div>
                <h3 className="font-semibold">Blockchain Integration</h3>
                <p className="text-sm text-white/70">Transparent & secure transactions</p>
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
              <CardTitle className="text-2xl gradient-text">Sign in</CardTitle>
              <CardDescription>
                Choose your preferred sign in method
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button 
                onClick={() => signIn()} 
                className="bg-white hover:bg-white/90 text-gray-900 hover:text-gray-900"
                size="lg"
              >
                <SiGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
