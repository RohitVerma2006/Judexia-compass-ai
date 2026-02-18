import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Brain, MessageSquare, HelpCircle, BookOpen, FileText,
  Users, Scale, Map, FileEdit, LogOut, Zap, Award, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import judexiaLogo from '@/assets/judexia-logo.jpg';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, xp, getLevel, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const level = getLevel();

  const NAV_ITEMS = [
    { path: '/dashboard', label: t('dashboard'), icon: Zap },
    { path: '/dashboard/case-studio', label: t('aiCaseStudio'), icon: Brain },
    { path: '/dashboard/mentor', label: t('aiLegalMentor'), icon: MessageSquare },
    { path: '/dashboard/quiz', label: t('quizMode'), icon: HelpCircle },
    { path: '/dashboard/case-library', label: t('caseLibrary'), icon: BookOpen },
    { path: '/dashboard/simplifier', label: t('docSimplifier'), icon: FileText },
    { path: '/dashboard/forum', label: t('communityForum'), icon: Users },
    { path: '/dashboard/consultation', label: t('lawyerConsult'), icon: Scale },
    { path: '/dashboard/roadmap', label: t('legalRoadmap'), icon: Map },
    { path: '/dashboard/notice', label: t('draftNotice'), icon: FileEdit },
  ];

  const handleLogout = async () => {
    await logout();
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

        {/* Language Toggle in Sidebar */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('language')}</span>
          </div>
          <div className="flex gap-1 bg-secondary/40 rounded-lg p-1">
            <button
              onClick={() => setLang('en')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${lang === 'en' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('english')}
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${lang === 'hi' ? 'bg-electric/20 text-electric' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('hindi')}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground/60 text-center">
            Judexia © 2026
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              {NAV_ITEMS.find(i => i.path === location.pathname)?.label || t('dashboard')}
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

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive" title={t('logout')}>
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
            {t('disclaimer')}
          </p>
        </footer>
      </div>
    </div>
  );
}
