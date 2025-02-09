import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/ui/navbar";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Campaign from "@/pages/campaign";
import SignIn from "@/pages/sign-in";
import ConnectWallet from "@/pages/connect-wallet";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/firebase";

function ProtectedRoute({ component: Component, ...props }: { component: React.ComponentType; path: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/sign-in";
    return null;
  }

  return <Component {...props} />;
}

function Router() {
  return (
    <>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/connect-wallet" component={ConnectWallet} />
          <Route path="/dashboard">
            <ProtectedRoute component={Dashboard} path="/dashboard" />
          </Route>
          <Route path="/profile">
            <ProtectedRoute component={Profile} path="/profile" />
          </Route>
          <Route path="/campaign/:id" component={Campaign} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;