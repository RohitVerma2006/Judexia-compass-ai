import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
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
import ConsultationRequests from "./pages/ConsultationRequests";
import Earnings from "./pages/Earnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading, role } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-gold font-serif text-xl animate-pulse">Loading Judexia...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-gold font-serif text-xl animate-pulse">Loading Judexia...</div>
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/about" replace />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/dashboard/case-studio" element={<ProtectedRoute><CaseStudio /></ProtectedRoute>} />
    <Route path="/dashboard/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
    <Route path="/dashboard/quiz" element={<ProtectedRoute allowedRoles={['citizen', 'aspirant']}><QuizMode /></ProtectedRoute>} />
    <Route path="/dashboard/case-library" element={<ProtectedRoute><CaseLibrary /></ProtectedRoute>} />
    <Route path="/dashboard/simplifier" element={<ProtectedRoute allowedRoles={['citizen']}><DocSimplifier /></ProtectedRoute>} />
    <Route path="/dashboard/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
    <Route path="/dashboard/consultation" element={<ProtectedRoute allowedRoles={['citizen', 'aspirant']}><Consultation /></ProtectedRoute>} />
    <Route path="/dashboard/roadmap" element={<ProtectedRoute allowedRoles={['citizen', 'aspirant']}><Roadmap /></ProtectedRoute>} />
    <Route path="/dashboard/notice" element={<ProtectedRoute><DraftNotice /></ProtectedRoute>} />
    <Route path="/dashboard/requests" element={<ProtectedRoute allowedRoles={['lawyer']}><ConsultationRequests /></ProtectedRoute>} />
    <Route path="/dashboard/earnings" element={<ProtectedRoute allowedRoles={['lawyer']}><Earnings /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
