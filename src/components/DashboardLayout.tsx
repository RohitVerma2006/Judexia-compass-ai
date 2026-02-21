import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Brain, MessageSquare, HelpCircle, BookOpen, FileText,
  Users, Scale, Map, FileEdit, LogOut, Zap, Award, Globe,
  ClipboardList, DollarSign, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import NotificationBell from '@/components/NotificationBell';
import judexiaLogo from '@/assets/judexia-logo.jpg';

const ALL_NAV = [
  { path: '/dashboard', labelKey: 'dashboard', icon: Zap, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/case-studio', labelKey: 'aiCaseStudio', icon: Brain, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/mentor', labelKey: 'aiLegalMentor', icon: MessageSquare, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/quiz', labelKey: 'quizMode', icon: HelpCircle, roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/case-library', labelKey: 'caseLibrary', icon: BookOpen, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/simplifier', labelKey: 'docSimplifier', icon: FileText, roles: ['citizen'] },
  { path: '/dashboard/forum', labelKey: 'communityForum', icon: Users, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/consultation', labelKey: 'lawyerConsult', icon: Scale, roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/roadmap', labelKey: 'legalRoadmap', icon: Map, roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/notice', labelKey: 'draftNotice', icon: FileEdit, roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/requests', labelKey: 'consultRequests', icon: ClipboardList, roles: ['lawyer'] },
  { path: '/dashboard/earnings', labelKey: 'myEarnings', icon: DollarSign, roles: ['lawyer'] },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, xp, getLevel, logout, role } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const level = getLevel();
  const userRole = role || 'citizen';

  const NAV_ITEMS = ALL_NAV.filter(n => n.roles.includes(userRole));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const xpProgress = level.max === Infinity ? 100 : ((xp - level.min) / (level.max - level.min)) * 100;

  return (
    <div className="min-h-screen gradient-bg flex">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <img src={judexiaLogo} alt="Judexia" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="font-serif text-lg font-bold text-foreground">Judexia</h1>
            <p className="text-xs text-muted-foreground">{t('legalAIPlatform')}</p>
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
                    ? 'bg-sidebar-accent text-electric font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(item.labelKey as any)}
              </Link>
            );
          })}
          <Link
            to="/about"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground border-t border-sidebar-border mt-1 pt-2.5"
          >
            <Globe className="w-4 h-4 shrink-0" />
            {t('aboutUs')}
          </Link>
        </nav>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('language')}</span>
          </div>
          <div className="flex gap-1 bg-secondary/40 rounded-lg p-1">
            <button onClick={() => setLang('en')} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${lang === 'en' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('english')}
            </button>
            <button onClick={() => setLang('hi')} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${lang === 'hi' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('hindi')}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground/60 text-center">{t('copyright')}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {NAV_ITEMS.find(i => i.path === location.pathname)?.labelKey
                ? t(NAV_ITEMS.find(i => i.path === location.pathname)!.labelKey as any)
                : t('dashboard')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-all text-xs font-medium"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-gold" />
                  <span className="text-muted-foreground">Light</span>
                </>
              )}
            </button>

            {/* Notification bell only for citizen/aspirant */}
            {userRole !== 'lawyer' && <NotificationBell />}

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-gold">{xp} XP</span>
              <div className="w-20">
                <Progress value={xpProgress} className="h-1.5 bg-muted [&>div]:bg-gold" />
              </div>
            </div>

            <Badge variant="outline" className="border-gold/40 text-gold text-xs">
              <Award className="w-3 h-3 mr-1" />
              {level.title}
            </Badge>

            <span className="text-sm text-foreground">{user?.fullName}</span>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive" title={t('logout')}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        <footer className="px-6 py-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground/50">{t('disclaimer')}</p>
        </footer>
      </div>
    </div>
  );
}
