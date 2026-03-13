import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import SafeRoute from "@/components/SafeRoute";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ProjectsPage from "./pages/ProjectsPage";
import ExperiencePage from "./pages/ExperiencePage";
import PreviewProjectsPage from "./pages/PreviewProjectsPage";
import PreviewExperiencePage from "./pages/PreviewExperiencePage";
import Dashboard from "./pages/Dashboard";
import DashboardPersonalInfo from "./pages/DashboardPersonalInfo";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import ExperienceDashboard from "./pages/ExperienceDashboard";
import PortfolioChat from "./components/PortfolioChat";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";
import PublicProjectsPage from "./pages/PublicProjectsPage";
import PublicExperiencePage from "./pages/PublicExperiencePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SafeRoute>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/preview" element={<PortfolioChat />} />
              <Route path="/preview/projects" element={<PreviewProjectsPage />} />
              <Route path="/preview/experience" element={<PreviewExperiencePage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/dashboard/personal" element={<DashboardPersonalInfo />} />
              <Route path="/app/dashboard/projects" element={<ProjectsDashboard />} />
              <Route path="/app/dashboard/experience" element={<ExperienceDashboard />} />
              <Route path="/app/projects" element={<ProjectsPage />} />
              <Route path="/app/experience" element={<ExperiencePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/portfolio/:personalSlug" element={<PublicPortfolioPage />} />
              <Route path="/portfolio/:personalSlug/projects" element={<PublicProjectsPage />} />
              <Route path="/portfolio/:personalSlug/experience" element={<PublicExperiencePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SafeRoute>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;