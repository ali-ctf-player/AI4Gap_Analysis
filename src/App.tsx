import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GRCProvider } from "@/contexts/GRCContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Framework from "@/pages/Framework";
import AssetManagement from "@/pages/AssetManagement";
import AssetAgents from "@/pages/AssetAgents";
import AssetApis from "@/pages/AssetApis";
import AssetImport from "@/pages/AssetImport";
import RisksOverview from "@/pages/RisksOverview";
import AssetRisk from "@/pages/AssetRisk";
import Compliance from "@/pages/Compliance";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GRCProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/framework" element={<Framework />} />
              <Route path="/assets" element={<AssetManagement />} />
              <Route path="/assets/management" element={<AssetManagement />} />
              <Route path="/assets/agents" element={<AssetAgents />} />
              <Route path="/assets/apis" element={<AssetApis />} />
              <Route path="/assets/import" element={<AssetImport />} />
              <Route path="/risks" element={<RisksOverview />} />
              <Route path="/risks/assets" element={<AssetRisk />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GRCProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
