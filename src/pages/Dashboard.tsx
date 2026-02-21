import { useAuth } from '@/contexts/AuthContext';
import { Brain, MessageSquare, HelpCircle, BookOpen, FileText, Users, Scale, Map, FileEdit, Trophy, DollarSign, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_MODULES = [
  { path: '/dashboard/case-studio', label: 'AI Case Studio', icon: Brain, desc: 'Analyze cases with AI-powered reasoning', color: 'from-blue-500/20 to-blue-600/10', roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/mentor', label: 'AI Legal Mentor', icon: MessageSquare, desc: 'Get guided legal mentorship', color: 'from-purple-500/20 to-purple-600/10', roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/quiz', label: 'Quiz Mode', icon: HelpCircle, desc: 'Test your legal knowledge', color: 'from-green-500/20 to-green-600/10', roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/case-library', label: 'Case Library', icon: BookOpen, desc: 'Browse landmark cases', color: 'from-amber-500/20 to-amber-600/10', roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/simplifier', label: 'Document Simplifier', icon: FileText, desc: 'Simplify complex legal documents', color: 'from-cyan-500/20 to-cyan-600/10', roles: ['citizen'] },
  { path: '/dashboard/forum', label: 'Community Forum', icon: Users, desc: 'Discuss with peers', color: 'from-rose-500/20 to-rose-600/10', roles: ['citizen', 'aspirant', 'lawyer'] },
  { path: '/dashboard/consultation', label: 'Lawyer Consultation', icon: Scale, desc: 'Book expert consultations', color: 'from-indigo-500/20 to-indigo-600/10', roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/roadmap', label: 'Legal Roadmap', icon: Map, desc: 'Plan your legal career path', color: 'from-teal-500/20 to-teal-600/10', roles: ['citizen', 'aspirant'] },
  { path: '/dashboard/notice', label: 'Draft Notice Generator', icon: FileEdit, desc: 'Generate legal notices', color: 'from-orange-500/20 to-orange-600/10', roles: ['citizen', 'aspirant', 'lawyer'] },
  // Lawyer-only modules
  { path: '/dashboard/requests', label: 'Consultation Requests', icon: ClipboardList, desc: 'Manage client requests', color: 'from-indigo-500/20 to-indigo-600/10', roles: ['lawyer'] },
  { path: '/dashboard/earnings', label: 'My Earnings', icon: DollarSign, desc: 'Track revenue & sessions', color: 'from-gold/20 to-amber-600/10', roles: ['lawyer'] },
];

export default function Dashboard() {
  const { user, xp, getLevel, role } = useAuth();
  const level = getLevel();
  const userRole = role || 'citizen';

  const visibleModules = ALL_MODULES.filter(m => m.roles.includes(userRole));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card-gold p-6">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-gold">{user?.fullName}</span>
        </h1>
        <p className="text-muted-foreground">
          You're a <span className="text-electric font-semibold">{level.title}</span> with <span className="text-gold font-semibold">{xp} XP</span>. Keep learning to level up!
        </p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-electric/10 text-electric border border-electric/30 capitalize">
          {userRole === 'aspirant' ? 'Law Aspirant' : userRole}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleModules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.path}
              to={mod.path}
              className="glass-card p-5 hover:border-electric/30 transition-all duration-300 group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-foreground group-hover:text-electric transition-colors">{mod.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{mod.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
