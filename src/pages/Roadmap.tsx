import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Zap, Brain, HelpCircle, FileText, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  label: string;
  xp: number;
  completed: boolean;
  link?: string;
}

interface Level {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

const INITIAL_LEVELS: Level[] = [
  {
    id: 'level-1',
    title: 'Foundation',
    description: 'Build your legal basics',
    tasks: [
      { id: 't1-1', label: 'Complete your first AI Case Studio session', xp: 20, completed: false, link: '/dashboard/case-studio' },
      { id: 't1-2', label: 'Score 60%+ in a Quiz', xp: 25, completed: false, link: '/dashboard/quiz' },
      { id: 't1-3', label: 'Simplify a legal document', xp: 15, completed: false, link: '/dashboard/simplifier' },
      { id: 't1-4', label: 'Read 2 cases from Case Library', xp: 20, completed: false, link: '/dashboard/case-library' },
    ],
  },
  {
    id: 'level-2',
    title: 'Intermediate',
    description: 'Deepen your legal reasoning',
    tasks: [
      { id: 't2-1', label: 'Analyze a Fundamental Rights case in Case Studio', xp: 30, completed: false, link: '/dashboard/case-studio' },
      { id: 't2-2', label: 'Ask 5 questions to AI Legal Mentor', xp: 25, completed: false, link: '/dashboard/mentor' },
      { id: 't2-3', label: 'Score 80%+ in Quiz Mode', xp: 35, completed: false, link: '/dashboard/quiz' },
      { id: 't2-4', label: 'Read landmark cases: Maneka Gandhi, Kesavananda', xp: 30, completed: false, link: '/dashboard/case-library' },
    ],
  },
  {
    id: 'level-3',
    title: 'Advanced',
    description: 'Master complex legal analysis',
    tasks: [
      { id: 't3-1', label: 'Write a complete case analysis and get 8/10+ from AI', xp: 50, completed: false, link: '/dashboard/case-studio' },
      { id: 't3-2', label: 'Draft a legal notice', xp: 40, completed: false, link: '/dashboard/notice' },
      { id: 't3-3', label: 'Complete all Quiz categories', xp: 45, completed: false, link: '/dashboard/quiz' },
      { id: 't3-4', label: 'Participate in Community Forum', xp: 20, completed: false, link: '/dashboard/forum' },
    ],
  },
  {
    id: 'level-4',
    title: 'Expert',
    description: 'Become a legal reasoning expert',
    tasks: [
      { id: 't4-1', label: 'Analyze 10 different case topics in Case Studio', xp: 60, completed: false, link: '/dashboard/case-studio' },
      { id: 't4-2', label: 'Score 90%+ in all Quiz categories', xp: 50, completed: false, link: '/dashboard/quiz' },
      { id: 't4-3', label: 'Help others in Community Forum (5 replies)', xp: 30, completed: false, link: '/dashboard/forum' },
      { id: 't4-4', label: 'Complete a full mock consultation analysis', xp: 40, completed: false, link: '/dashboard/case-studio' },
    ],
  },
];

const STORAGE_KEY = 'judexia-roadmap-progress';

export default function Roadmap() {
  const { addXP, xp } = useAuth();
  const [levels, setLevels] = useState<Level[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_LEVELS;
  });
  const [expandedLevel, setExpandedLevel] = useState<string | null>('level-1');
  const [animatingTask, setAnimatingTask] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  }, [levels]);

  const totalTasks = levels.reduce((sum, l) => sum + l.tasks.length, 0);
  const completedTasks = levels.reduce((sum, l) => sum + l.tasks.filter(t => t.completed).length, 0);
  const overallProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleTask = (levelId: string, taskId: string) => {
    setLevels(prev => prev.map(l => {
      if (l.id !== levelId) return l;
      return {
        ...l,
        tasks: l.tasks.map(t => {
          if (t.id !== taskId) return t;
          if (!t.completed) {
            setAnimatingTask(taskId);
            setTimeout(() => setAnimatingTask(null), 1000);
            addXP(t.xp);
          }
          return { ...t, completed: !t.completed };
        }),
      };
    }));
  };

  const getLevelProgress = (level: Level) => {
    const done = level.tasks.filter(t => t.completed).length;
    return level.tasks.length ? Math.round((done / level.tasks.length) * 100) : 0;
  };

  const getLevelXP = (level: Level) => level.tasks.reduce((sum, t) => sum + (t.completed ? t.xp : 0), 0);
  const getLevelTotalXP = (level: Level) => level.tasks.reduce((sum, t) => sum + t.xp, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Growth Score */}
      <div className="glass-card-gold p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif text-xl font-bold">Your Legal Growth Score</h2>
            <p className="text-sm text-muted-foreground">Track your learning journey and unlock achievements.</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold" />
            <span className="font-serif text-2xl font-bold text-gold">{overallProgress}%</span>
          </div>
        </div>
        <Progress value={overallProgress} className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-electric [&>div]:to-gold" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{completedTasks} of {totalTasks} tasks completed</span>
          <span className="text-gold font-semibold">{xp} XP earned</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric via-gold to-muted hidden md:block" />

        <div className="space-y-4">
          {levels.map((level, idx) => {
            const progress = getLevelProgress(level);
            const isExpanded = expandedLevel === level.id;
            const isComplete = progress === 100;

            return (
              <div key={level.id} className="relative">
                {/* Timeline dot */}
                <div className={`hidden md:flex absolute left-6 w-5 h-5 rounded-full border-2 items-center justify-center z-10 transition-all ${
                  isComplete ? 'bg-gold border-gold' : progress > 0 ? 'bg-electric/20 border-electric' : 'bg-muted border-border'
                }`}>
                  {isComplete && <CheckCircle className="w-3 h-3 text-background" />}
                </div>

                <div className={`md:ml-16 glass-card overflow-hidden transition-all duration-300 ${isComplete ? 'border-gold/30' : ''}`}>
                  <button
                    onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isComplete ? 'bg-gold/20' : 'bg-electric/10'
                      }`}>
                        <span className="font-serif font-bold text-sm">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-foreground">{level.title}</h3>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">{progress}%</p>
                        <p className="text-[10px] text-gold">{getLevelXP(level)}/{getLevelTotalXP(level)} XP</p>
                      </div>
                      <div className="w-16">
                        <Progress value={progress} className={`h-1.5 bg-muted ${isComplete ? '[&>div]:bg-gold' : '[&>div]:bg-electric'}`} />
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-2 border-t border-border/30 pt-3">
                      {level.tasks.map(task => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            task.completed ? 'bg-gold/5' : 'hover:bg-secondary/20'
                          } ${animatingTask === task.id ? 'animate-scale-in' : ''}`}
                        >
                          <button onClick={() => toggleTask(level.id, task.id)} className="shrink-0">
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-gold" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground hover:text-electric transition-colors" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.label}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              task.completed ? 'bg-gold/10 text-gold' : 'bg-electric/10 text-electric'
                            }`}>
                              <Zap className="w-3 h-3 inline mr-0.5" />{task.xp} XP
                            </span>
                            {task.link && !task.completed && (
                              <Link to={task.link} className="text-[10px] px-2 py-1 rounded bg-electric/10 text-electric hover:bg-electric/20 transition-colors">
                                Go →
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
