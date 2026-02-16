import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import CaseStudio from "./pages/CaseStudio";
import AIMentor from "./pages/AIMentor";
import QuizMode from "./pages/QuizMode";
import CaseLibrary from "./pages/CaseLibrary";
import DocSimplifier from "./pages/DocSimplifier";
import Forum from "./pages/Forum";
import Consultation from "./pages/Consultation";
import Roadmap from "./pages/Roadmap";
import DraftNotice from "./pages/DraftNotice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/dashboard/case-studio" element={<ProtectedRoute><CaseStudio /></ProtectedRoute>} />
    <Route path="/dashboard/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
    <Route path="/dashboard/quiz" element={<ProtectedRoute><QuizMode /></ProtectedRoute>} />
    <Route path="/dashboard/case-library" element={<ProtectedRoute><CaseLibrary /></ProtectedRoute>} />
    <Route path="/dashboard/simplifier" element={<ProtectedRoute><DocSimplifier /></ProtectedRoute>} />
    <Route path="/dashboard/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
    <Route path="/dashboard/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
    <Route path="/dashboard/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
    <Route path="/dashboard/notice" element={<ProtectedRoute><DraftNotice /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
