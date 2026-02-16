import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Brain, MessageSquare, HelpCircle, BookOpen, FileText,
  Users, Scale, Map, FileEdit, LogOut, Zap, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import judexiaLogo from '@/assets/judexia-logo.jpg';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Zap },
  { path: '/dashboard/case-studio', label: 'AI Case Studio', icon: Brain },
  { path: '/dashboard/mentor', label: 'AI Legal Mentor', icon: MessageSquare },
  { path: '/dashboard/quiz', label: 'Quiz Mode', icon: HelpCircle },
  { path: '/dashboard/case-library', label: 'Case Library', icon: BookOpen },
  { path: '/dashboard/simplifier', label: 'Doc Simplifier', icon: FileText },
  { path: '/dashboard/forum', label: 'Community Forum', icon: Users },
  { path: '/dashboard/consultation', label: 'Lawyer Consult', icon: Scale },
  { path: '/dashboard/roadmap', label: 'Legal Roadmap', icon: Map },
  { path: '/dashboard/notice', label: 'Draft Notice', icon: FileEdit },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, xp, getLevel, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const level = getLevel();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const xpProgress = level.max === Infinity ? 100 : ((xp - level.min) / (level.max - level.min)) * 100;

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <img src={judexiaLogo} alt="Judexia" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="font-serif text-lg font-bold text-foreground">Judexia</h1>
            <p className="text-xs text-muted-foreground">Legal AI Platform</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-sidebar-accent text-electric glow-electric/20 font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground/60 text-center">
            Prototype Simulation
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-5">
            {/* XP */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-gold">{xp} XP</span>
              <div className="w-20">
                <Progress value={xpProgress} className="h-1.5 bg-muted [&>div]:bg-gold" />
              </div>
            </div>

            {/* Level */}
            <Badge variant="outline" className="border-gold/40 text-gold text-xs">
              <Award className="w-3 h-3 mr-1" />
              {level.title}
            </Badge>

            {/* User */}
            <span className="text-sm text-foreground">{user?.fullName}</span>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground/50">
            Judexia is an educational platform and does not provide official legal advice. All AI outputs shown here are prototype simulations.
          </p>
        </footer>
      </div>
    </div>
  );
}
